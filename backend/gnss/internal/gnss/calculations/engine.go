package calculations

import (
	"context"
	"fmt"
	"math"
	"sort"
	"time"

	"github.com/joshuaferrara/go-satellite"
	"gonum.org/v1/gonum/mat"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/providers"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
	gnsstypes "github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/types"
	"github.com/Coastal-PASS/landing-page/backend/gnss/pkg/gnss"
	mathx "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/math"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// Engine bundles provider manager and DB access for calculations.
type Engine struct {
	providers *providers.Manager
	db        services.DB
}

// NewEngine constructs the calculation engine.
func NewEngine(mgr *providers.Manager, db services.DB) *Engine {
	return &Engine{
		providers: mgr,
		db:        db,
	}
}

// Visibility returns satellite passes for the provided query.
func (e *Engine) Visibility(ctx context.Context, query gnsstypes.VisibilityQuery) (apptypes.SatelliteVisibilityResponse, error) {
	if query.Start.IsZero() {
		query.Start = time.Now().UTC()
	}
	if query.End.IsZero() || query.End.Before(query.Start) {
		query.End = query.Start.Add(12 * time.Hour)
	}
	tles, err := e.providers.FetchTLE(ctx, providers.TLERequest{Limit: 25})
	if err != nil {
		return apptypes.SatelliteVisibilityResponse{}, err
	}

	location := apptypes.Coordinate{
		Latitude:   query.Latitude,
		Longitude:  query.Longitude,
		ElevationM: query.ElevationM,
	}

	var passes []apptypes.SatellitePass
	for _, tleRecord := range tles {
		tle := gnss.TLE{
			Name:  tleRecord.Name,
			Line1: tleRecord.Line1,
			Line2: tleRecord.Line2,
		}
		ps, err := gnss.VisiblePasses(tle, gnss.PassRequest{
			Location: location,
			Start:    query.Start,
			End:      query.End,
			Step:     time.Minute,
		})
		if err != nil {
			continue
		}
		passes = append(passes, ps...)
		if len(passes) >= 20 {
			break
		}
	}

	sort.Slice(passes, func(i, j int) bool {
		return passes[i].Start.Before(passes[j].Start)
	})
	if len(passes) > 20 {
		passes = passes[:20]
	}

	return apptypes.SatelliteVisibilityResponse{
		Location:       location,
		Passes:         passes,
		SatelliteCount: len(tles),
		UpdatedAt:      time.Now(),
		Source:         "computed",
	}, nil
}

// DOP computes PDOP/HDOP/VDOP metrics from current satellites.
func (e *Engine) DOP(ctx context.Context, query gnsstypes.DopQuery) (apptypes.DopResponse, error) {
	now := time.Now().UTC()
	tles, err := e.providers.FetchTLE(ctx, providers.TLERequest{Limit: 50})
	if err != nil {
		return apptypes.DopResponse{}, err
	}

	unitRows := make([]float64, 0, len(tles)*4)
	active := 0
	for _, tleRecord := range tles {
		sat := gnss.TLE{
			Name:  tleRecord.Name,
			Line1: tleRecord.Line1,
			Line2: tleRecord.Line2,
		}
		row, visible := losRow(sat, apptypes.Coordinate{
			Latitude:   query.Latitude,
			Longitude:  query.Longitude,
			ElevationM: query.ElevationM,
		}, now)
		if !visible {
			continue
		}
		unitRows = append(unitRows, row...)
		active++
	}

	if active < 4 {
		return apptypes.DopResponse{}, fmt.Errorf("insufficient satellites for DOP")
	}

	matrix := mat.NewDense(active, 4, unitRows)
	q := mathx.TransposeMultiply(matrix)
	inv, err := mathx.Invert(q)
	if err != nil {
		return apptypes.DopResponse{}, err
	}
	pdop := math.Sqrt(inv.At(0, 0) + inv.At(1, 1) + inv.At(2, 2))
	hdop := math.Sqrt(inv.At(0, 0) + inv.At(1, 1))
	vdop := math.Sqrt(inv.At(2, 2))

	return apptypes.DopResponse{
		Coordinate: apptypes.Coordinate{
			Latitude:   query.Latitude,
			Longitude:  query.Longitude,
			ElevationM: query.ElevationM,
		},
		PDOP:           pdop,
		HDOP:           hdop,
		VDOP:           vdop,
		SatelliteCount: active,
		ComputedAt:     now,
	}, nil
}

func losRow(tle gnss.TLE, coord apptypes.Coordinate, ts time.Time) ([]float64, bool) {
	sat := satellite.ParseTLE(tle.Line1, tle.Line2, satellite.GravityWGS84)
	year, month, day := ts.Date()
	hour, min, sec := ts.Clock()
	position, _ := satellite.Propagate(sat, year, int(month), day, hour, min, sec)
	jday := satellite.JDay(year, int(month), day, hour, min, sec)
	observer := satellite.LatLong{
		Latitude:  coord.Latitude * satellite.DEG2RAD,
		Longitude: coord.Longitude * satellite.DEG2RAD,
	}
	look := satellite.ECIToLookAngles(position, observer, coord.ElevationM/1000, jday)
	elevation := look.El * satellite.RAD2DEG
	if elevation < 5 {
		return nil, false
	}
	az := look.Az
	el := look.El
	ux := math.Cos(el) * math.Sin(az)
	uy := math.Cos(el) * math.Cos(az)
	uz := math.Sin(el)
	return []float64{ux, uy, uz, 1}, true
}

// TecHeatmap aggregates TEC samples from Timescale.
func (e *Engine) TecHeatmap(ctx context.Context, query gnsstypes.TecQuery) (apptypes.TecHeatmapResponse, error) {
	window := query.WindowMinutes
	if window == 0 {
		window = 30
	}
	rows, err := e.db.Query(ctx, `
		SELECT latitude, longitude, tec_value, data_source, sampled_at
		FROM gnss_tec_samples
		WHERE sampled_at >= now() - ($1 || ' minutes')::interval
		ORDER BY sampled_at DESC
		LIMIT 200
	`, window)
	if err != nil {
		return apptypes.TecHeatmapResponse{}, err
	}
	defer rows.Close()

	var cells []apptypes.TecCell
	var sampledAt time.Time
	var source string
	for rows.Next() {
		var cell apptypes.TecCell
		if err := rows.Scan(&cell.Latitude, &cell.Longitude, &cell.Value, &source, &sampledAt); err != nil {
			return apptypes.TecHeatmapResponse{}, err
		}
		cells = append(cells, cell)
	}
	if err := rows.Err(); err != nil {
		return apptypes.TecHeatmapResponse{}, err
	}
	return apptypes.TecHeatmapResponse{
		Cells:      cells,
		DataSource: source,
		SampledAt:  sampledAt,
	}, nil
}

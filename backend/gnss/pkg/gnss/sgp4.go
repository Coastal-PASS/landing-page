package gnss

import (
	"strconv"
	"strings"
	"time"

	"github.com/joshuaferrara/go-satellite"

	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// TLE encapsulates a parsed two-line element.
type TLE struct {
	Name  string
	Line1 string
	Line2 string
}

// PassRequest defines the propagation window.
type PassRequest struct {
	Location apptypes.Coordinate
	Start    time.Time
	End      time.Time
	Step     time.Duration
}

// VisiblePasses computes pass windows where elevation stays above zero degrees.
func VisiblePasses(tle TLE, req PassRequest) ([]apptypes.SatellitePass, error) {
	step := req.Step
	if step == 0 {
		step = time.Minute
	}
	sat := satellite.ParseTLE(tle.Line1, tle.Line2, satellite.GravityWGS84)
	observer := satellite.LatLong{
		Latitude:  req.Location.Latitude * satellite.DEG2RAD,
		Longitude: req.Location.Longitude * satellite.DEG2RAD,
	}

	var passes []apptypes.SatellitePass
	var current *apptypes.SatellitePass

	for ts := req.Start; !ts.After(req.End); ts = ts.Add(step) {
		year, month, day := ts.Date()
		hour, min, sec := ts.Clock()
		position, _ := satellite.Propagate(sat, year, int(month), day, hour, min, sec)
		jday := satellite.JDay(year, int(month), day, hour, min, sec)
		look := satellite.ECIToLookAngles(position, observer, req.Location.ElevationM/1000, jday)
		elevationDeg := look.El * satellite.RAD2DEG
		azimuthDeg := look.Az * satellite.RAD2DEG

		if elevationDeg > 0 {
			if current == nil {
				current = &apptypes.SatellitePass{
					SatelliteName: tle.Name,
					NORADID:       extractNorad(tle.Line1),
					Start:         ts,
					MaxElevation:  elevationDeg,
					AOSAzimuth:    azimuthDeg,
				}
			}
			current.End = ts
			current.LOSAzimuth = azimuthDeg
			if elevationDeg > current.MaxElevation {
				current.MaxElevation = elevationDeg
			}
		} else if current != nil {
			passes = append(passes, *current)
			current = nil
		}
	}
	if current != nil {
		passes = append(passes, *current)
	}
	return passes, nil
}

func extractNorad(line1 string) int {
	if len(line1) < 7 {
		return 0
	}
	value := line1[2:7]
	n, _ := strconv.Atoi(strings.TrimSpace(value))
	return n
}

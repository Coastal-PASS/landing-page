package providers

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// TimescaleProvider reads cached TLE data from Supabase.
type TimescaleProvider struct {
	db services.DB
}

// NewTimescaleProvider instantiates the provider.
func NewTimescaleProvider(db services.DB) *TimescaleProvider {
	return &TimescaleProvider{db: db}
}

func (p *TimescaleProvider) Name() string {
	return "timescale_cache"
}

// FetchTLE returns the most recent cached TLE rows.
func (p *TimescaleProvider) FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error) {
	limit := req.Limit
	if limit == 0 {
		limit = 20
	}
	query := `
		SELECT norad_id, tle_line1, tle_line2, source, recorded_at
		FROM gnss_tle_snapshots
		ORDER BY recorded_at DESC
		LIMIT $1
	`
	if len(req.NORADIDs) > 0 {
		query = `
			SELECT norad_id, tle_line1, tle_line2, source, recorded_at
			FROM gnss_tle_snapshots
			WHERE norad_id = ANY($1)
			ORDER BY recorded_at DESC
		`
		rows, err := p.db.Query(ctx, query, req.NORADIDs)
		if err != nil {
			return nil, err
		}
		defer rows.Close()
		return pgx.CollectRows[TLERecord](rows, scanTLE)
	}

	rows, err := p.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return pgx.CollectRows[TLERecord](rows, scanTLE)
}

// Health exposes provider status by checking row counts.
func (p *TimescaleProvider) Health(ctx context.Context) apptypes.ProviderHealth {
	row := p.db.QueryRow(ctx, `SELECT count(*) FROM gnss_tle_snapshots`)
	var count int64
	if err := row.Scan(&count); err != nil {
		return apptypes.ProviderHealth{
			Provider:  p.Name(),
			Status:    "degraded",
			LastError: fmt.Sprintf("query failed: %v", err),
		}
	}
	status := "healthy"
	if count == 0 {
		status = "degraded"
	}
	return apptypes.ProviderHealth{
		Provider: p.Name(),
		Status:   status,
	}
}

func scanTLE(row pgx.CollectableRow) (TLERecord, error) {
	var record TLERecord
	if err := row.Scan(&record.NORADID, &record.Line1, &record.Line2, &record.Source, &record.CapturedAt); err != nil {
		return TLERecord{}, err
	}
	record.Name = fmt.Sprintf("NORAD-%d", record.NORADID)
	return record, nil
}

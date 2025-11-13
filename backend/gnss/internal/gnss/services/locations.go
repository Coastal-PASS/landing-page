package services

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"

	gnsstypes "github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/types"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// LocationService manages saved WorkOS-scoped locations.
type LocationService struct {
	db DB
}

// NewLocationService constructs the service.
func NewLocationService(db DB) *LocationService {
	return &LocationService{db: db}
}

// List fetches Org-scoped saved locations ordered by update time.
func (s *LocationService) List(ctx context.Context, orgID string) ([]apptypes.SavedLocation, error) {
	rows, err := s.db.Query(ctx, `
		SELECT id, org_id, user_id, name, latitude, longitude, elevation_m, created_at, updated_at
		FROM saved_locations
		WHERE org_id = $1
		ORDER BY updated_at DESC
	`, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return pgx.CollectRows[apptypes.SavedLocation](rows, scanLocationCollect)
}

// Create inserts a new saved location.
func (s *LocationService) Create(ctx context.Context, orgID, userID string, payload gnsstypes.LocationPayload) (apptypes.SavedLocation, error) {
	row := s.db.QueryRow(ctx, `
		INSERT INTO saved_locations (org_id, user_id, name, latitude, longitude, elevation_m)
		VALUES ($1,$2,$3,$4,$5,$6)
		RETURNING id, org_id, user_id, name, latitude, longitude, elevation_m, created_at, updated_at
	`, orgID, userID, payload.Name, payload.Latitude, payload.Longitude, payload.ElevationM)

	return decodeLocation(row)
}

// LocationUpdate contains optional fields to update.
type LocationUpdate struct {
	Name       *string
	Latitude   *float64
	Longitude  *float64
	ElevationM *float64
}

// Update mutates an existing location.
func (s *LocationService) Update(ctx context.Context, orgID, locationID string, upd LocationUpdate) (apptypes.SavedLocation, error) {
	setParts := []string{}
	args := []any{}
	argPos := 1

	add := func(clause string, value any) {
		setParts = append(setParts, fmt.Sprintf("%s = $%d", clause, argPos))
		args = append(args, value)
		argPos++
	}

	if upd.Name != nil {
		add("name", *upd.Name)
	}
	if upd.Latitude != nil {
		add("latitude", *upd.Latitude)
	}
	if upd.Longitude != nil {
		add("longitude", *upd.Longitude)
	}
	if upd.ElevationM != nil {
		add("elevation_m", *upd.ElevationM)
	}

	if len(setParts) == 0 {
		return apptypes.SavedLocation{}, fmt.Errorf("no fields to update")
	}

	setParts = append(setParts, fmt.Sprintf("updated_at = $%d", argPos))
	args = append(args, time.Now().UTC())
	updateSQL := fmt.Sprintf(`
		UPDATE saved_locations
		SET %s
		WHERE id = $%d AND org_id = $%d
		RETURNING id, org_id, user_id, name, latitude, longitude, elevation_m, created_at, updated_at
	`, strings.Join(setParts, ","), argPos+1, argPos+2)
	args = append(args, locationID, orgID)

	row := s.db.QueryRow(ctx, updateSQL, args...)
	return decodeLocation(row)
}

// Delete removes a saved location.
func (s *LocationService) Delete(ctx context.Context, orgID, locationID string) error {
	cmd, err := s.db.Exec(ctx, `
		DELETE FROM saved_locations WHERE id = $1 AND org_id = $2
	`, locationID, orgID)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("location not found")
	}
	return nil
}

type locationScanner interface {
	Scan(dest ...any) error
}

func scanLocationCollect(row pgx.CollectableRow) (apptypes.SavedLocation, error) {
	return decodeLocation(row)
}

func decodeLocation(row locationScanner) (apptypes.SavedLocation, error) {
	var loc apptypes.SavedLocation
	if err := row.Scan(&loc.ID, &loc.OrgID, &loc.UserID, &loc.Name, &loc.Coordinate.Latitude, &loc.Coordinate.Longitude, &loc.Coordinate.ElevationM, &loc.CreatedAt, &loc.UpdatedAt); err != nil {
		return apptypes.SavedLocation{}, err
	}
	return loc, nil
}

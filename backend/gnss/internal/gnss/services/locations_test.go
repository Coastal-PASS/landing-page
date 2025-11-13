package services

import (
	"context"
	"regexp"
	"testing"
	"time"

	pgxmock "github.com/pashagolub/pgxmock/v4"

	gnsstypes "github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/types"
)

func TestLocationServiceCreate(t *testing.T) {
	mock, err := pgxmock.NewPool()
	if err != nil {
		t.Fatalf("new pgxmock: %v", err)
	}
	defer mock.Close()

	service := NewLocationService(mock)
	rows := pgxmock.NewRows([]string{
		"id", "org_id", "user_id", "name", "latitude", "longitude", "elevation_m", "created_at", "updated_at",
	}).AddRow("id", "org", "user", "Field", 1.0, 2.0, 3.0, time.Now(), time.Now())

	mock.ExpectQuery(regexp.QuoteMeta("INSERT INTO saved_locations")).
		WithArgs("org", "user", "Field", 1.0, 2.0, 3.0).
		WillReturnRows(rows)

	_, err = service.Create(context.Background(), "org", "user", gnsstypes.LocationPayload{
		Name:       "Field",
		Latitude:   1,
		Longitude:  2,
		ElevationM: 3,
	})
	if err != nil {
		t.Fatalf("create location: %v", err)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet expectations: %v", err)
	}
}

func TestLocationServiceUpdateNoFields(t *testing.T) {
	mock, err := pgxmock.NewPool()
	if err != nil {
		t.Fatalf("new pgxmock: %v", err)
	}
	defer mock.Close()

	service := NewLocationService(mock)

	if _, err := service.Update(context.Background(), "org", "location", LocationUpdate{}); err == nil {
		t.Fatalf("expected error when no fields provided")
	}
}

func TestLocationServiceDelete(t *testing.T) {
	mock, err := pgxmock.NewPool()
	if err != nil {
		t.Fatalf("pgxmock: %v", err)
	}
	defer mock.Close()

	service := NewLocationService(mock)
	mock.ExpectExec(regexp.QuoteMeta("DELETE FROM saved_locations")).WithArgs("loc", "org").WillReturnResult(pgxmock.NewResult("DELETE", 1))

	if err := service.Delete(context.Background(), "org", "loc"); err != nil {
		t.Fatalf("delete expected nil err: %v", err)
	}
}

package services

import (
	"context"
	"regexp"
	"testing"
	"time"

	pgxmock "github.com/pashagolub/pgxmock/v4"

	gnsstypes "github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/types"
)

func TestAlertServiceCreate(t *testing.T) {
	mock, _ := pgxmock.NewPool()
	defer mock.Close()
	service := NewAlertService(mock)

	rows := pgxmock.NewRows([]string{
		"id", "org_id", "user_id", "name", "rule_type", "threshold_value", "schedule_cron", "notification_channel", "status", "created_at", "updated_at",
	}).AddRow("alert", "org", "user", "PDOP", "PDOP_THRESHOLD", 6.5, "*/5 * * * *", "email", "active", time.Now(), time.Now())

	mock.ExpectQuery(regexp.QuoteMeta("INSERT INTO alert_rules")).
		WithArgs("org", "user", "PDOP", "PDOP_THRESHOLD", 6.5, "*/5 * * * *", "email", "active").
		WillReturnRows(rows)

	_, err := service.Create(context.Background(), "org", "user", gnsstypes.AlertPayload{
		Name:                "PDOP",
		RuleType:            "PDOP_THRESHOLD",
		ThresholdValue:      6.5,
		ScheduleCron:        "*/5 * * * *",
		NotificationChannel: "email",
		Status:              "active",
	})
	if err != nil {
		t.Fatalf("create alert: %v", err)
	}
}

func TestAlertServiceDelete(t *testing.T) {
	mock, _ := pgxmock.NewPool()
	defer mock.Close()
	service := NewAlertService(mock)

	mock.ExpectExec(regexp.QuoteMeta("DELETE FROM alert_rules")).
		WithArgs("alert", "org").
		WillReturnResult(pgxmock.NewResult("DELETE", 1))

	if err := service.Delete(context.Background(), "org", "alert"); err != nil {
		t.Fatalf("delete alert: %v", err)
	}
}

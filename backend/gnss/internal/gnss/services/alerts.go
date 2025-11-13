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

// AlertService handles alert rule CRUD + event history.
type AlertService struct {
	db DB
}

// NewAlertService builds the alert service.
func NewAlertService(db DB) *AlertService {
	return &AlertService{db: db}
}

// List returns alert rules filtered by optional status.
func (s *AlertService) List(ctx context.Context, orgID string, status string) ([]apptypes.AlertRule, error) {
	query := `
		SELECT id, org_id, user_id, name, rule_type, threshold_value, schedule_cron, notification_channel, status, created_at, updated_at
		FROM alert_rules`
	clauses := []string{}
	args := []any{}
	if orgID != "" {
		clauses = append(clauses, fmt.Sprintf("org_id = $%d", len(args)+1))
		args = append(args, orgID)
	}
	if status != "" {
		clauses = append(clauses, fmt.Sprintf("status = $%d", len(args)+1))
		args = append(args, status)
	}
	if len(clauses) > 0 {
		query += " WHERE " + strings.Join(clauses, " AND ")
	}
	query += " ORDER BY updated_at DESC"

	rows, err := s.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return pgx.CollectRows[apptypes.AlertRule](rows, scanAlertRuleCollect)
}

// Create inserts a new alert rule.
func (s *AlertService) Create(ctx context.Context, orgID, userID string, payload gnsstypes.AlertPayload) (apptypes.AlertRule, error) {
	if payload.Status == "" {
		payload.Status = "active"
	}
	row := s.db.QueryRow(ctx, `
		INSERT INTO alert_rules (org_id, user_id, name, rule_type, threshold_value, schedule_cron, notification_channel, status)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
		RETURNING id, org_id, user_id, name, rule_type, threshold_value, schedule_cron, notification_channel, status, created_at, updated_at
	`, orgID, userID, payload.Name, payload.RuleType, payload.ThresholdValue, payload.ScheduleCron, payload.NotificationChannel, payload.Status)

	return decodeAlertRule(row)
}

// Update modifies alert fields.
func (s *AlertService) Update(ctx context.Context, orgID, alertID string, payload gnsstypes.AlertPayload) (apptypes.AlertRule, error) {
	setParts := []string{}
	args := []any{}
	pos := 1
	if payload.Name != "" {
		setParts = append(setParts, fmt.Sprintf("name = $%d", pos))
		args = append(args, payload.Name)
		pos++
	}
	if payload.RuleType != "" {
		setParts = append(setParts, fmt.Sprintf("rule_type = $%d", pos))
		args = append(args, payload.RuleType)
		pos++
	}
	if payload.ThresholdValue != 0 {
		setParts = append(setParts, fmt.Sprintf("threshold_value = $%d", pos))
		args = append(args, payload.ThresholdValue)
		pos++
	}
	if payload.ScheduleCron != "" {
		setParts = append(setParts, fmt.Sprintf("schedule_cron = $%d", pos))
		args = append(args, payload.ScheduleCron)
		pos++
	}
	if payload.NotificationChannel != "" {
		setParts = append(setParts, fmt.Sprintf("notification_channel = $%d", pos))
		args = append(args, payload.NotificationChannel)
		pos++
	}
	if payload.Status != "" {
		setParts = append(setParts, fmt.Sprintf("status = $%d", pos))
		args = append(args, payload.Status)
		pos++
	}
	if len(setParts) == 0 {
		return apptypes.AlertRule{}, fmt.Errorf("no fields to update")
	}
	setParts = append(setParts, fmt.Sprintf("updated_at = $%d", pos))
	args = append(args, time.Now().UTC())
	pos++

	query := fmt.Sprintf(`
		UPDATE alert_rules
		SET %s
		WHERE id = $%d AND org_id = $%d
		RETURNING id, org_id, user_id, name, rule_type, threshold_value, schedule_cron, notification_channel, status, created_at, updated_at
	`, strings.Join(setParts, ","), pos, pos+1)
	args = append(args, alertID, orgID)

	row := s.db.QueryRow(ctx, query, args...)
	return decodeAlertRule(row)
}

// Delete removes an alert.
func (s *AlertService) Delete(ctx context.Context, orgID, alertID string) error {
	cmd, err := s.db.Exec(ctx, `
		DELETE FROM alert_rules WHERE id = $1 AND org_id = $2
	`, alertID, orgID)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return fmt.Errorf("alert not found")
	}
	return nil
}

// ListEvents returns alert firing history.
func (s *AlertService) ListEvents(ctx context.Context, alertID string, limit int) ([]apptypes.AlertEvent, error) {
	if limit <= 0 {
		limit = 50
	}
	rows, err := s.db.Query(ctx, `
		SELECT id, alert_rule_id, triggered_at, payload, delivered, delivered_at
		FROM alert_events
		WHERE alert_rule_id = $1
		ORDER BY triggered_at DESC
		LIMIT $2
	`, alertID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return pgx.CollectRows[apptypes.AlertEvent](rows, func(row pgx.CollectableRow) (apptypes.AlertEvent, error) {
		var event apptypes.AlertEvent
		if err := row.Scan(&event.ID, &event.AlertRuleID, &event.TriggeredAt, &event.Payload, &event.Delivered, &event.DeliveredAt); err != nil {
			return apptypes.AlertEvent{}, err
		}
		return event, nil
	})
}

type alertScanner interface {
	Scan(dest ...any) error
}

func scanAlertRuleCollect(row pgx.CollectableRow) (apptypes.AlertRule, error) {
	return decodeAlertRule(row)
}

func decodeAlertRule(row alertScanner) (apptypes.AlertRule, error) {
	var rule apptypes.AlertRule
	if err := row.Scan(
		&rule.ID,
		&rule.OrgID,
		&rule.UserID,
		&rule.Name,
		&rule.RuleType,
		&rule.ThresholdValue,
		&rule.ScheduleCron,
		&rule.NotificationChannel,
		&rule.Status,
		&rule.CreatedAt,
		&rule.UpdatedAt,
	); err != nil {
		return apptypes.AlertRule{}, err
	}
	return rule, nil
}

package scheduler

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"time"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/calculations"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/providers"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
	gnsstypes "github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/types"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// TLERefreshJob fetches latest TLE data and stores it in Timescale.
type TLERefreshJob struct {
	manager  *providers.Manager
	db       services.DB
	interval time.Duration
}

// TecRefreshJob seeds TEC samples for dashboards.
type TecRefreshJob struct {
	db       services.DB
	interval time.Duration
}

func NewTecRefreshJob(db services.DB, interval time.Duration) *TecRefreshJob {
	return &TecRefreshJob{db: db, interval: interval}
}

func (j *TecRefreshJob) ID() string              { return "refresh_tec" }
func (j *TecRefreshJob) Interval() time.Duration { return j.interval }

func (j *TecRefreshJob) Run(ctx context.Context) error {
	now := time.Now().UTC()
	for lat := -60; lat <= 60; lat += 10 {
		for lon := -180; lon <= 180; lon += 20 {
			value := math.Abs(math.Sin(float64(lat)*math.Pi/180)+math.Cos(float64(lon)*math.Pi/180)) * 20
			if _, err := j.db.Exec(ctx, `
				INSERT INTO gnss_tec_samples (latitude, longitude, tec_value, data_source, sampled_at)
				VALUES ($1,$2,$3,'synthetic',$4)
			`, lat, lon, value, now); err != nil {
				return err
			}
		}
	}
	return nil
}

// NewTLERefreshJob wires dependencies.
func NewTLERefreshJob(mgr *providers.Manager, db services.DB, interval time.Duration) *TLERefreshJob {
	return &TLERefreshJob{manager: mgr, db: db, interval: interval}
}

func (j *TLERefreshJob) ID() string              { return "refresh_tle" }
func (j *TLERefreshJob) Interval() time.Duration { return j.interval }

func (j *TLERefreshJob) Run(ctx context.Context) error {
	records, err := j.manager.FetchTLE(ctx, providers.TLERequest{Limit: 50})
	if err != nil {
		return err
	}
	for _, rec := range records {
		if _, err := j.db.Exec(ctx, `
			INSERT INTO gnss_tle_snapshots (norad_id, tle_line1, tle_line2, source, recorded_at)
			VALUES ($1,$2,$3,$4,$5)
			ON CONFLICT DO NOTHING
		`, rec.NORADID, rec.Line1, rec.Line2, rec.Source, rec.CapturedAt); err != nil {
			return err
		}
	}
	return nil
}

// AlertEvaluationJob evaluates alert rules and enqueues events.
type AlertEvaluationJob struct {
	alerts   *services.AlertService
	engine   *calculations.Engine
	notify   *services.NotificationService
	db       services.DB
	interval time.Duration
}

func NewAlertEvaluationJob(alerts *services.AlertService, engine *calculations.Engine, notify *services.NotificationService, db services.DB, interval time.Duration) *AlertEvaluationJob {
	return &AlertEvaluationJob{
		alerts:   alerts,
		engine:   engine,
		notify:   notify,
		db:       db,
		interval: interval,
	}
}

func (j *AlertEvaluationJob) ID() string              { return "evaluate_alerts" }
func (j *AlertEvaluationJob) Interval() time.Duration { return j.interval }

func (j *AlertEvaluationJob) Run(ctx context.Context) error {
	rules, err := j.alerts.List(ctx, "", "active")
	if err != nil {
		return err
	}
	for _, rule := range rules {
		triggered, metric := j.evaluateRule(ctx, rule)
		if !triggered {
			continue
		}
		payload := map[string]any{
			"rule_id":   rule.ID,
			"metric":    metric,
			"threshold": rule.ThresholdValue,
			"org_id":    rule.OrgID,
		}
		body, _ := json.Marshal(payload)
		_, err := j.db.Exec(ctx, `
			INSERT INTO alert_events (alert_rule_id, triggered_at, payload)
			VALUES ($1, now(), $2::jsonb)
		`, rule.ID, string(body))
		if err != nil {
			return err
		}
		if j.notify != nil {
			_ = j.notify.Send(ctx, fmt.Sprintf("%s@workos.local", rule.OrgID), fmt.Sprintf("Alert triggered: %s", rule.Name), fmt.Sprintf("Metric %.2f exceeded threshold %.2f", metric, rule.ThresholdValue))
		}
	}
	return nil
}

func (j *AlertEvaluationJob) evaluateRule(ctx context.Context, rule apptypes.AlertRule) (bool, float64) {
	switch rule.RuleType {
	case "PDOP_THRESHOLD":
		resp, err := j.engine.DOP(ctx, gnsstypes.DopQuery{Latitude: 0, Longitude: 0})
		if err != nil {
			return false, 0
		}
		return resp.PDOP >= rule.ThresholdValue, resp.PDOP
	case "TEC_SPIKE":
		resp, err := j.engine.TecHeatmap(ctx, gnsstypes.TecQuery{WindowMinutes: 30})
		if err != nil || len(resp.Cells) == 0 {
			return false, 0
		}
		metric := resp.Cells[0].Value
		return metric >= rule.ThresholdValue, metric
	default:
		return false, 0
	}
}

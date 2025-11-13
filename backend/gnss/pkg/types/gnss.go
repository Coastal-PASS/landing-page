package types

import "time"

// Coordinate describes user-provided lat/lon/elevation.
type Coordinate struct {
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
	ElevationM float64 `json:"elevation_m"`
}

// SatellitePass contains a single satellite visibility window.
type SatellitePass struct {
	SatelliteName string    `json:"satellite_name"`
	NORADID       int       `json:"norad_id"`
	Start         time.Time `json:"start"`
	End           time.Time `json:"end"`
	MaxElevation  float64   `json:"max_elevation"`
	AOSAzimuth    float64   `json:"aos_azimuth"`
	LOSAzimuth    float64   `json:"los_azimuth"`
}

// SatelliteVisibilityResponse wraps multiple passes.
type SatelliteVisibilityResponse struct {
	Location       Coordinate      `json:"location"`
	Passes         []SatellitePass `json:"passes"`
	SatelliteCount int             `json:"satellite_count"`
	UpdatedAt      time.Time       `json:"updated_at"`
	Source         string          `json:"source"`
}

// TecCell represents a TEC value for a coordinate.
type TecCell struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Value     float64 `json:"value"`
}

// TecHeatmapResponse holds TEC grids.
type TecHeatmapResponse struct {
	Cells      []TecCell `json:"cells"`
	DataSource string    `json:"data_source"`
	SampledAt  time.Time `json:"sampled_at"`
}

// DopResponse contains DOP metrics.
type DopResponse struct {
	Coordinate     Coordinate `json:"location"`
	PDOP           float64    `json:"pdop"`
	HDOP           float64    `json:"hdop"`
	VDOP           float64    `json:"vdop"`
	SatelliteCount int        `json:"satellite_count"`
	ComputedAt     time.Time  `json:"computed_at"`
}

// ProviderHealth describes provider availability.
type ProviderHealth struct {
	Provider    string    `json:"provider"`
	Status      string    `json:"status"`
	LastSuccess time.Time `json:"last_success,omitempty"`
	LastError   string    `json:"last_error,omitempty"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// SavedLocation is scoped via WorkOS org.
type SavedLocation struct {
	ID         string     `json:"id"`
	Name       string     `json:"name"`
	OrgID      string     `json:"org_id"`
	UserID     string     `json:"user_id"`
	Coordinate Coordinate `json:"coordinate"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

// AlertRule stores PDOP/TEC thresholds.
type AlertRule struct {
	ID                  string    `json:"id"`
	Name                string    `json:"name"`
	OrgID               string    `json:"org_id"`
	UserID              string    `json:"user_id"`
	RuleType            string    `json:"rule_type"`
	ThresholdValue      float64   `json:"threshold_value"`
	ScheduleCron        string    `json:"schedule_cron"`
	NotificationChannel string    `json:"notification_channel"`
	Status              string    `json:"status"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// AlertEvent records fired alerts.
type AlertEvent struct {
	ID          string    `json:"id"`
	AlertRuleID string    `json:"alert_rule_id"`
	TriggeredAt time.Time `json:"triggered_at"`
	Payload     any       `json:"payload"`
	Delivered   bool      `json:"delivered"`
	DeliveredAt time.Time `json:"delivered_at,omitempty"`
}

// SchedulerStatus summarises job health.
type SchedulerStatus struct {
	Jobs []JobStatus `json:"jobs"`
}

// JobStatus covers a specific job.
type JobStatus struct {
	ID        string    `json:"id"`
	LastRun   time.Time `json:"last_run"`
	LastError string    `json:"last_error,omitempty"`
	Healthy   bool      `json:"healthy"`
}

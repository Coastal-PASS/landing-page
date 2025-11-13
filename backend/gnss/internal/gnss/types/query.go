package gnsstypes

import "time"

// VisibilityQuery wraps query params for the visibility endpoint.
type VisibilityQuery struct {
	Latitude   float64
	Longitude  float64
	ElevationM float64
	Start      time.Time
	End        time.Time
}

// TecQuery defines TEC sampling requests.
type TecQuery struct {
	Latitude      float64
	Longitude     float64
	RadiusKM      float64
	WindowMinutes int
}

// DopQuery represents DOP calculation inputs.
type DopQuery struct {
	Latitude      float64
	Longitude     float64
	ElevationM    float64
	WindowMinutes int
}

// LocationPayload is used by CRUD handlers for saved locations.
type LocationPayload struct {
	Name       string  `json:"name"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
	ElevationM float64 `json:"elevation_m"`
}

// AlertPayload defines create/update payloads for alert rules.
type AlertPayload struct {
	Name                string  `json:"name"`
	RuleType            string  `json:"rule_type"`
	ThresholdValue      float64 `json:"threshold_value"`
	ScheduleCron        string  `json:"schedule_cron"`
	NotificationChannel string  `json:"notification_channel"`
	Status              string  `json:"status"`
}

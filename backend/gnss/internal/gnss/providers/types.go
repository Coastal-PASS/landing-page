package providers

import (
	"context"
	"time"

	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// TLERequest represents requests for satellite TLE data.
type TLERequest struct {
	NORADIDs []int
	Limit    int
}

// TLERecord represents a TLE snapshot.
type TLERecord struct {
	Name       string
	NORADID    int
	Line1      string
	Line2      string
	Source     string
	CapturedAt time.Time
}

// ProviderClient fetches GNSS telemetry from upstream providers.
type ProviderClient interface {
	Name() string
	FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error)
	Health(ctx context.Context) apptypes.ProviderHealth
}

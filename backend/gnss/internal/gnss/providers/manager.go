package providers

import (
	"context"
	"fmt"

	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// Manager orchestrates multiple provider clients with failover logic.
type Manager struct {
	clients []ProviderClient
}

// NewManager constructs the provider manager.
func NewManager(clients ...ProviderClient) *Manager {
	filtered := clients[:0]
	for _, c := range clients {
		if c != nil {
			filtered = append(filtered, c)
		}
	}
	return &Manager{clients: filtered}
}

// FetchTLE iterates providers in order until one succeeds.
func (m *Manager) FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error) {
	var lastErr error
	for _, client := range m.clients {
		data, err := client.FetchTLE(ctx, req)
		if err == nil && len(data) > 0 {
			return data, nil
		}
		if err != nil {
			lastErr = err
			continue
		}
	}
	if lastErr == nil {
		lastErr = fmt.Errorf("no provider returned data")
	}
	return nil, lastErr
}

// Health aggregates provider status information.
func (m *Manager) Health(ctx context.Context) []apptypes.ProviderHealth {
	status := make([]apptypes.ProviderHealth, 0, len(m.clients))
	for _, client := range m.clients {
		status = append(status, client.Health(ctx))
	}
	return status
}

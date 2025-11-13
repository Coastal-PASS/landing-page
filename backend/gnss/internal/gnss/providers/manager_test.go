package providers

import (
	"context"
	"errors"
	"testing"

	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

type stubProvider struct {
	name string
	tle  []TLERecord
	err  error
}

func (s stubProvider) Name() string { return s.name }
func (s stubProvider) FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error) {
	if s.err != nil {
		return nil, s.err
	}
	return s.tle, nil
}
func (s stubProvider) Health(ctx context.Context) apptypes.ProviderHealth {
	return apptypes.ProviderHealth{Provider: s.name}
}

func TestManagerFailover(t *testing.T) {
	manager := NewManager(
		stubProvider{name: "a", err: errors.New("down")},
		stubProvider{name: "b", tle: []TLERecord{{Name: "SAT"}}},
	)

	data, err := manager.FetchTLE(context.Background(), TLERequest{})
	if err != nil {
		t.Fatalf("expected success: %v", err)
	}
	if len(data) != 1 || data[0].Name != "SAT" {
		t.Fatalf("unexpected data: %#v", data)
	}
}

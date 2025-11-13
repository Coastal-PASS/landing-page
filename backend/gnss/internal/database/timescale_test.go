package database

import (
	"testing"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
)

func TestResolveDSN(t *testing.T) {
	cfg := config.SupabaseConfig{
		DirectDSN: "postgres://direct",
		PooledDSN: "postgres://pooled",
	}

	dsn, err := resolveDSN(cfg)
	if err != nil {
		t.Fatalf("expected no error: %v", err)
	}
	if dsn != "postgres://direct" {
		t.Fatalf("expected direct DSN to win, got %s", dsn)
	}

	cfg.DirectDSN = ""
	dsn, err = resolveDSN(cfg)
	if err != nil {
		t.Fatalf("expected pooled fallback: %v", err)
	}
	if dsn != "postgres://pooled" {
		t.Fatalf("expected pooled fallback, got %s", dsn)
	}

	cfg.PooledDSN = ""
	if _, err := resolveDSN(cfg); err == nil {
		t.Fatalf("expected error when DSNs missing")
	}
}

package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadWithFileOverrides(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "config.yaml")
	if err := os.WriteFile(path, []byte(`
env: test
server:
  port: 9090
supabase:
  pooled_dsn: postgres://pooled
redis:
  url: redis://example
workos:
  api_key: sk_test
  client_id: client_test
api_keys:
  anonymous_public: demo-key
`), 0o644); err != nil {
		t.Fatalf("write config: %v", err)
	}

	cfg, err := Load(path)
	if err != nil {
		t.Fatalf("load config: %v", err)
	}

	if cfg.Env != "test" {
		t.Fatalf("expected env test, got %s", cfg.Env)
	}
	if cfg.Server.Port != 9090 {
		t.Fatalf("expected port 9090, got %d", cfg.Server.Port)
	}
	if cfg.Supabase.PooledDSN != "postgres://pooled" {
		t.Fatalf("expected pooled_dsn override")
	}
}

func TestEnvOverrides(t *testing.T) {
	t.Setenv("SUPABASE_DB_URL", "postgres://pooled")
	t.Setenv("REDIS_URL", "redis://override")
	t.Setenv("WORKOS_API_KEY", "sk_env")
	t.Setenv("WORKOS_CLIENT_ID", "client_env")
	t.Setenv("GNSS_API_KEY_PUBLIC", "env-demo")

	cfg, err := Load("")
	if err != nil {
		t.Fatalf("load default config: %v", err)
	}

	if cfg.Supabase.PooledDSN != "postgres://pooled" {
		t.Fatalf("expected env override for Supabase pooled dsn")
	}
	if cfg.Redis.URL != "redis://override" {
		t.Fatalf("expected redis env override, got %s", cfg.Redis.URL)
	}
	if cfg.APIKeys.AnonymousPublic != "env-demo" {
		t.Fatalf("expected env demo key, got %s", cfg.APIKeys.AnonymousPublic)
	}
}

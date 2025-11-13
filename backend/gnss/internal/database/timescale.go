package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
)

// NewTimescalePool builds a pgxpool configured for Supabase/Timescale.
func NewTimescalePool(ctx context.Context, cfg config.SupabaseConfig) (*pgxpool.Pool, error) {
	dsn, err := resolveDSN(cfg)
	if err != nil {
		return nil, err
	}

	poolCfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("parse pgx config: %w", err)
	}

	if cfg.MaxConnections > 0 {
		poolCfg.MaxConns = cfg.MaxConnections
	}

	poolCfg.HealthCheckPeriod = 30 * time.Second
	poolCfg.MaxConnLifetime = time.Hour
	poolCfg.MaxConnIdleTime = 5 * time.Minute
	poolCfg.ConnConfig.RuntimeParams["application_name"] = cfg.AppName

	pool, err := pgxpool.NewWithConfig(ctx, poolCfg)
	if err != nil {
		return nil, fmt.Errorf("create pgx pool: %w", err)
	}

	return pool, nil
}

// Ping ensures the DB connection is live.
func Ping(ctx context.Context, pool *pgxpool.Pool) error {
	if pool == nil {
		return fmt.Errorf("pgx pool is nil")
	}
	return pool.Ping(ctx)
}

func resolveDSN(cfg config.SupabaseConfig) (string, error) {
	switch {
	case cfg.DirectDSN != "":
		return cfg.DirectDSN, nil
	case cfg.PooledDSN != "":
		return cfg.PooledDSN, nil
	default:
		return "", fmt.Errorf("supabase DSN not configured")
	}
}

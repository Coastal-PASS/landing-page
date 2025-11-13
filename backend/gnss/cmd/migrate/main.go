package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
)

func main() {
	var configPath string
	var dsn string
	var dir string
	flag.StringVar(&configPath, "config", "", "Path to config.yaml")
	flag.StringVar(&dsn, "dsn", "", "Postgres DSN override")
	flag.StringVar(&dir, "dir", "migrations", "Migrations directory")
	flag.Parse()

	if dsn == "" {
		cfg, err := config.Load(configPath)
		if err != nil {
			panic(err)
		}
		if cfg.Supabase.DirectDSN != "" {
			dsn = cfg.Supabase.DirectDSN
		} else {
			dsn = cfg.Supabase.PooledDSN
		}
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		panic(err)
	}
	defer pool.Close()

	if _, err := pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS gnss_schema_migrations (
			filename text primary key,
			applied_at timestamptz not null default now()
		)
	`); err != nil {
		panic(err)
	}

	files, err := filepath.Glob(filepath.Join(dir, "*.sql"))
	if err != nil {
		panic(err)
	}
	sort.Strings(files)

	for _, file := range files {
		var exists bool
		if err := pool.QueryRow(ctx, `SELECT EXISTS (SELECT 1 FROM gnss_schema_migrations WHERE filename = $1)`, filepath.Base(file)).Scan(&exists); err != nil {
			panic(err)
		}
		if exists {
			continue
		}
		sqlBytes, err := os.ReadFile(file)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Applying %s\n", file)
		if _, err := pool.Exec(ctx, string(sqlBytes)); err != nil {
			panic(fmt.Errorf("apply %s: %w", file, err))
		}
		if _, err := pool.Exec(ctx, `INSERT INTO gnss_schema_migrations (filename) VALUES ($1)`, filepath.Base(file)); err != nil {
			panic(err)
		}
	}
}

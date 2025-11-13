# Supabase Timescale Playbook

## Key Docs
- Timescale on Supabase overview: https://docs.supabase.com/guides/database/extensions/timescaledb
- TimescaleDB hypertables + retention: https://docs.timescale.com/api/latest/hypertables/create_hypertable/
- Supavisor pooling limits + connection strings: https://supabase.com/docs/guides/platform/supavisor#connection-limits
- Vector + Timescale compatibility (shared extension management): https://supabase.com/blog/pgvector-timescaledb-batteries-included

## Enabling TimescaleDB
1. Open Supabase project → Database → Extensions → enable **timescaledb** (requires Pro tier or BYO). This runs `CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE`.
2. Verify the extension is active: `select installed_version from pg_available_extensions where name='timescaledb';`.
3. Apply connection pooling changes if needed; Supabase’s default pooler (Supavisor) limits each project to 100 connections—Timescale background workers count toward that quota.

## Hypertable Migrations
Place SQL migrations under `backend/gnss/migrations` with timestamped filenames:
```sql
-- 202501131200_init_timescale.sql
CREATE TABLE gnss_tle_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  norad_id integer NOT NULL,
  tle_line1 text NOT NULL,
  tle_line2 text NOT NULL,
  captured_at timestamptz NOT NULL
);
SELECT create_hypertable('gnss_tle_snapshots', 'captured_at', if_not_exists => TRUE);
SELECT add_retention_policy('gnss_tle_snapshots', INTERVAL '45 days');
```
- Use `SELECT set_chunk_time_interval('gnss_tle_snapshots', INTERVAL '6 hours');` to balance insert/write amplification for SGP4 updates.
- Keep TEC, DOP, provider_health tables separate hypertables—Timescale parallelizes queries across chunks.

## Connection Handling
- Use the transactional connection string (suffix `?pgbouncer=true`) for OLTP workloads; when running background ingestion or long-lived calculations, connect directly (no pgbouncer) to avoid transaction timeouts.
- Configure `PGAPPNAME='gnss-service'` so Supavisor metrics attribute connections to the new service.
- Pooling: prefer `pgxpool` with `MaxConns` <= 20 locally, <= 40 in production to stay under Supabase quotas and leave headroom for manual queries.

## Continuous Aggregates & Compression
- Timescale continuous aggregates reduce expensive TEC heatmap queries:
```sql
CREATE MATERIALIZED VIEW tec_daily_avg
WITH (timescaledb.continuous) AS
SELECT
  location_id,
  time_bucket(INTERVAL '1 day', sampled_at) AS bucket,
  avg(vtec) as avg_vtec
FROM gnss_tec_samples
GROUP BY 1,2;
```
- Enable compression on historical tables to keep Supabase storage costs predictable:
```sql
ALTER TABLE gnss_tle_snapshots SET (timescaledb.compress = true);
SELECT add_compression_policy('gnss_tle_snapshots', INTERVAL '14 days');
```

## Local Development
- Use Docker Compose with the official `supabase/postgres` image plus `timescaledb=on`.
- Seed data using `psql -f backend/gnss/migrations/*.sql`.
- Run `go run ./cmd/migrate --dsn $DATABASE_URL` before starting the API so hypertables exist.


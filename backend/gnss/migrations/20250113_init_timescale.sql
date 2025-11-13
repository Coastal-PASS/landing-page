CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS gnss_tle_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    norad_id integer NOT NULL,
    tle_line1 text NOT NULL,
    tle_line2 text NOT NULL,
    source text NOT NULL,
    recorded_at timestamptz NOT NULL
);
SELECT create_hypertable('gnss_tle_snapshots', 'recorded_at', if_not_exists => TRUE);
SELECT add_retention_policy('gnss_tle_snapshots', INTERVAL '45 days');
SELECT set_chunk_time_interval('gnss_tle_snapshots', INTERVAL '6 hours');
SELECT add_compression_policy('gnss_tle_snapshots', INTERVAL '7 days');

INSERT INTO gnss_tle_snapshots (norad_id, tle_line1, tle_line2, source, recorded_at)
VALUES (
    25544,
    '1 25544U 98067A   25001.54791667  .00001264  00000+0  33233-4 0  9992',
    '2 25544  51.6448 126.2524 0004981  87.4565  20.5463 15.50363167432145',
    'seed',
    now()
) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS gnss_tec_samples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude numeric(6,3) NOT NULL,
    longitude numeric(6,3) NOT NULL,
    tec_value numeric(8,3) NOT NULL,
    data_source text NOT NULL,
    sampled_at timestamptz NOT NULL
);
SELECT create_hypertable('gnss_tec_samples', 'sampled_at', if_not_exists => TRUE);
SELECT add_retention_policy('gnss_tec_samples', INTERVAL '30 days');
SELECT add_compression_policy('gnss_tec_samples', INTERVAL '5 days');

INSERT INTO gnss_tec_samples (latitude, longitude, tec_value, data_source, sampled_at)
VALUES (37.0, -122.0, 12.5, 'seed', now())
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS gnss_dop_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location geography(Point, 4326) NOT NULL,
    pdop numeric(5,2) NOT NULL,
    hdop numeric(5,2) NOT NULL,
    vdop numeric(5,2) NOT NULL,
    satellite_count smallint NOT NULL,
    computed_at timestamptz NOT NULL
);
SELECT create_hypertable('gnss_dop_metrics', 'computed_at', if_not_exists => TRUE);
SELECT add_retention_policy('gnss_dop_metrics', INTERVAL '30 days');

CREATE TABLE IF NOT EXISTS gnss_provider_health (
    provider text PRIMARY KEY,
    status text NOT NULL,
    last_success timestamptz,
    last_error text,
    updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO gnss_provider_health (provider, status, updated_at)
VALUES ('space_track', 'unknown', now()),
       ('celestrak', 'unknown', now()),
       ('n2yo', 'unknown', now()),
       ('timescale_cache', 'healthy', now())
ON CONFLICT (provider) DO NOTHING;

CREATE TABLE IF NOT EXISTS scheduler_jobs (
    id text PRIMARY KEY,
    last_run_status text,
    last_error text,
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gnss_api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    token text UNIQUE NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

INSERT INTO gnss_api_keys (token, description)
VALUES ('demo', 'Default anonymous key')
ON CONFLICT (token) DO NOTHING;

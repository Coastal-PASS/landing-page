CREATE TABLE IF NOT EXISTS saved_locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id text NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    latitude numeric(6,3) NOT NULL,
    longitude numeric(6,3) NOT NULL,
    elevation_m numeric(6,2) DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (org_id, name)
);
CREATE INDEX IF NOT EXISTS saved_locations_org_idx ON saved_locations(org_id);

CREATE TABLE IF NOT EXISTS alert_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id text NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    rule_type text NOT NULL CHECK (rule_type IN ('PDOP_THRESHOLD','TEC_SPIKE')),
    threshold_value numeric(6,2) NOT NULL,
    schedule_cron text NOT NULL,
    notification_channel text NOT NULL DEFAULT 'email',
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (org_id, name)
);
CREATE INDEX IF NOT EXISTS alert_rules_org_idx ON alert_rules(org_id);

CREATE TABLE IF NOT EXISTS alert_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id uuid REFERENCES alert_rules(id) ON DELETE CASCADE,
    triggered_at timestamptz NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false,
    delivered_at timestamptz
);
CREATE INDEX IF NOT EXISTS alert_events_rule_idx ON alert_events(alert_rule_id, triggered_at DESC);

CREATE TABLE IF NOT EXISTS notification_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id uuid REFERENCES alert_rules(id) ON DELETE CASCADE,
    channel text NOT NULL,
    payload jsonb NOT NULL,
    scheduled_at timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'pending'
);

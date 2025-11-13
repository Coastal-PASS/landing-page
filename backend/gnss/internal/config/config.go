package config

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/yaml.v3"
)

// Config captures all runtime settings required by the GNSS backend. Values
// come from YAML files (for local dev) and can be overridden by environment
// variables documented in `.env.example`.
type Config struct {
	Env           string              `yaml:"env" envconfig:"GNSS_ENV"`
	Server        ServerConfig        `yaml:"server"`
	Supabase      SupabaseConfig      `yaml:"supabase"`
	Redis         RedisConfig         `yaml:"redis"`
	WorkOS        WorkOSConfig        `yaml:"workos"`
	APIKeys       APIKeysConfig       `yaml:"api_keys"`
	Providers     ProvidersConfig     `yaml:"providers"`
	Observability Observability       `yaml:"observability"`
	Scheduler     SchedulerConfig     `yaml:"scheduler"`
	Email         EmailConfig         `yaml:"email"`
	RateLimit     RateLimitConfig     `yaml:"rate_limit"`
	Notifications NotificationsConfig `yaml:"notifications"`
}

// ServerConfig controls runtime servers for API + metrics.
type ServerConfig struct {
	Port                int           `yaml:"port" envconfig:"GNSS_SERVER_PORT"`
	MetricsPort         int           `yaml:"metrics_port" envconfig:"GNSS_METRICS_PORT"`
	BaseURL             string        `yaml:"base_url" envconfig:"GNSS_BASE_URL"`
	ShutdownGracePeriod time.Duration `yaml:"shutdown_grace_period" envconfig:"GNSS_SHUTDOWN_GRACE_PERIOD"`
	ReadTimeout         time.Duration `yaml:"read_timeout" envconfig:"GNSS_SERVER_READ_TIMEOUT"`
	WriteTimeout        time.Duration `yaml:"write_timeout" envconfig:"GNSS_SERVER_WRITE_TIMEOUT"`
	IdleTimeout         time.Duration `yaml:"idle_timeout" envconfig:"GNSS_SERVER_IDLE_TIMEOUT"`
	EnablePprof         bool          `yaml:"enable_pprof" envconfig:"GNSS_SERVER_ENABLE_PPROF"`
	EnableSwagger       bool          `yaml:"enable_swagger" envconfig:"GNSS_SERVER_ENABLE_SWAGGER"`
}

// SupabaseConfig holds Timescale/PG access details.
type SupabaseConfig struct {
	PooledDSN      string `yaml:"pooled_dsn" envconfig:"SUPABASE_DB_URL"`
	DirectDSN      string `yaml:"direct_dsn" envconfig:"SUPABASE_DB_DIRECT_URL"`
	ServiceRoleKey string `yaml:"service_role_key" envconfig:"SUPABASE_SERVICE_ROLE_KEY"`
	MaxConnections int32  `yaml:"max_connections" envconfig:"SUPABASE_MAX_CONNECTIONS"`
	AppName        string `yaml:"app_name" envconfig:"SUPABASE_APP_NAME"`
}

// RedisConfig contains cache + limiter settings.
type RedisConfig struct {
	URL          string        `yaml:"url" envconfig:"REDIS_URL"`
	TLSEnabled   bool          `yaml:"tls" envconfig:"REDIS_TLS_ENABLED"`
	DialTimeout  time.Duration `yaml:"dial_timeout" envconfig:"REDIS_DIAL_TIMEOUT"`
	ReadTimeout  time.Duration `yaml:"read_timeout" envconfig:"REDIS_READ_TIMEOUT"`
	WriteTimeout time.Duration `yaml:"write_timeout" envconfig:"REDIS_WRITE_TIMEOUT"`
	PoolSize     int           `yaml:"pool_size" envconfig:"REDIS_POOL_SIZE"`
}

// WorkOSConfig covers API keys and JWKS validation options.
type WorkOSConfig struct {
	APIKey              string        `yaml:"api_key" envconfig:"WORKOS_API_KEY"`
	ClientID            string        `yaml:"client_id" envconfig:"WORKOS_CLIENT_ID"`
	JWKSURL             string        `yaml:"jwks_url" envconfig:"WORKOS_JWKS_URL"`
	CacheTTL            time.Duration `yaml:"cache_ttl" envconfig:"WORKOS_JWKS_TTL"`
	RequiredPermissions []string      `yaml:"required_permissions" envconfig:"WORKOS_REQUIRED_PERMISSIONS"`
	AdminRoles          []string      `yaml:"admin_roles" envconfig:"WORKOS_ADMIN_ROLES"`
}

// APIKeysConfig contains shared keys used by API clients.
type APIKeysConfig struct {
	AnonymousPublic string `yaml:"anonymous_public" envconfig:"GNSS_API_KEY_PUBLIC"`
}

// ProvidersConfig groups credentials for upstream GNSS data sources.
type ProvidersConfig struct {
	SpaceTrack SpaceTrackConfig `yaml:"space_track"`
	CelesTrak  CelesTrakConfig  `yaml:"celestrak"`
	N2YO       N2YOConfig       `yaml:"n2yo"`
	TEC        TECConfig        `yaml:"tec"`
}

// SpaceTrackConfig configures the Space-Track client.
type SpaceTrackConfig struct {
	Username string        `yaml:"username" envconfig:"SPACE_TRACK_USER"`
	Password string        `yaml:"password" envconfig:"SPACE_TRACK_PASS"`
	BaseURL  string        `yaml:"base_url" envconfig:"SPACE_TRACK_BASE_URL"`
	Timeout  time.Duration `yaml:"timeout" envconfig:"SPACE_TRACK_TIMEOUT"`
}

// CelesTrakConfig configures CelesTrak sourcing.
type CelesTrakConfig struct {
	BaseURL string        `yaml:"base_url" envconfig:"CELESTRAK_BASE_URL"`
	Timeout time.Duration `yaml:"timeout" envconfig:"CELESTRAK_TIMEOUT"`
}

// N2YOConfig configures the N2YO API.
type N2YOConfig struct {
	APIKey  string        `yaml:"api_key" envconfig:"N2YO_API_KEY"`
	BaseURL string        `yaml:"base_url" envconfig:"N2YO_BASE_URL"`
	Timeout time.Duration `yaml:"timeout" envconfig:"N2YO_TIMEOUT"`
}

// TECConfig configures NASA/NOAA TEC ingestion.
type TECConfig struct {
	BaseURL        string        `yaml:"base_url" envconfig:"TEC_BASE_URL"`
	RefreshCadence time.Duration `yaml:"refresh_cadence" envconfig:"TEC_REFRESH_CADENCE"`
	User           string        `yaml:"username" envconfig:"NASA_CDDIS_USER"`
	Password       string        `yaml:"password" envconfig:"NASA_CDDIS_PASS"`
}

// Observability defines logging/metrics sinks.
type Observability struct {
	SentryDSN     string `yaml:"sentry_dsn" envconfig:"SENTRY_DSN"`
	PromNamespace string `yaml:"prometheus_namespace" envconfig:"PROM_NAMESPACE"`
	LogFormat     string `yaml:"log_format" envconfig:"GNSS_LOG_FORMAT"`
}

// SchedulerConfig handles background jobs.
type SchedulerConfig struct {
	Enabled                bool          `yaml:"enabled" envconfig:"GNSS_SCHEDULER_ENABLED"`
	PollInterval           time.Duration `yaml:"poll_interval" envconfig:"GNSS_SCHEDULER_POLL_INTERVAL"`
	RefreshTLEInterval     time.Duration `yaml:"refresh_tle_interval" envconfig:"GNSS_REFRESH_TLE_INTERVAL"`
	RefreshTECInterval     time.Duration `yaml:"refresh_tec_interval" envconfig:"GNSS_REFRESH_TEC_INTERVAL"`
	EvaluateAlertsInterval time.Duration `yaml:"evaluate_alerts_interval" envconfig:"GNSS_EVALUATE_ALERTS_INTERVAL"`
	HealthInterval         time.Duration `yaml:"provider_health_interval" envconfig:"GNSS_PROVIDER_HEALTH_INTERVAL"`
}

// EmailConfig configures outbound notifications.
type EmailConfig struct {
	SendGridAPIKey string `yaml:"sendgrid_api_key" envconfig:"SENDGRID_API_KEY"`
	FromAddress    string `yaml:"from_address" envconfig:"SENDGRID_FROM_ADDRESS"`
}

// NotificationsConfig toggles alert delivery channels.
type NotificationsConfig struct {
	Email bool `yaml:"email" envconfig:"NOTIFICATIONS_EMAIL"`
}

// RateLimitConfig defines limiter windows.
type RateLimitConfig struct {
	AnonymousPerMinute     int64 `yaml:"anonymous_per_minute" envconfig:"GNSS_ANONYMOUS_RPM"`
	AuthenticatedPerMinute int64 `yaml:"authenticated_per_minute" envconfig:"GNSS_AUTHENTICATED_RPM"`
	WindowSeconds          int64 `yaml:"window_seconds" envconfig:"GNSS_RATE_LIMIT_WINDOW"`
}

// Load builds Config from optional YAML path plus env variable overrides.
func Load(path string) (*Config, error) {
	cfg := defaultConfig()

	if path != "" {
		data, err := os.ReadFile(path)
		if err != nil {
			return nil, fmt.Errorf("read config: %w", err)
		}
		if err := yaml.Unmarshal(data, cfg); err != nil {
			return nil, fmt.Errorf("parse config: %w", err)
		}
	}

	if err := envconfig.Process("", cfg); err != nil {
		return nil, fmt.Errorf("env override: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// defaultConfig seeds sane defaults before YAML/env overrides.
func defaultConfig() *Config {
	return &Config{
		Env: "development",
		Server: ServerConfig{
			Port:                8080,
			MetricsPort:         9100,
			BaseURL:             "http://localhost:8080",
			ShutdownGracePeriod: 20 * time.Second,
			ReadTimeout:         10 * time.Second,
			WriteTimeout:        20 * time.Second,
			IdleTimeout:         time.Minute,
		},
		Supabase: SupabaseConfig{
			MaxConnections: 10,
			AppName:        "gnss-service",
		},
		Redis: RedisConfig{
			URL:          "redis://localhost:6379/0",
			DialTimeout:  5 * time.Second,
			ReadTimeout:  2 * time.Second,
			WriteTimeout: 2 * time.Second,
			PoolSize:     10,
		},
		WorkOS: WorkOSConfig{
			JWKSURL:  "https://api.workos.com/sso/jwks",
			CacheTTL: 5 * time.Minute,
		},
		APIKeys: APIKeysConfig{
			AnonymousPublic: "demo",
		},
		Providers: ProvidersConfig{
			SpaceTrack: SpaceTrackConfig{
				BaseURL: "https://www.space-track.org",
				Timeout: 15 * time.Second,
			},
			CelesTrak: CelesTrakConfig{
				BaseURL: "https://celestrak.org/NORAD/elements",
				Timeout: 10 * time.Second,
			},
			N2YO: N2YOConfig{
				BaseURL: "https://api.n2yo.com/rest/v1/satellite",
				Timeout: 10 * time.Second,
			},
			TEC: TECConfig{
				BaseURL:        "https://services.swpc.noaa.gov",
				RefreshCadence: 15 * time.Minute,
			},
		},
		Observability: Observability{
			PromNamespace: "gnss",
			LogFormat:     "text",
		},
		Scheduler: SchedulerConfig{
			Enabled:                true,
			PollInterval:           time.Minute,
			RefreshTLEInterval:     30 * time.Minute,
			RefreshTECInterval:     15 * time.Minute,
			EvaluateAlertsInterval: 5 * time.Minute,
			HealthInterval:         5 * time.Minute,
		},
		Email: EmailConfig{
			FromAddress: "gnss@localhost",
		},
		RateLimit: RateLimitConfig{
			AnonymousPerMinute:     60,
			AuthenticatedPerMinute: 300,
			WindowSeconds:          60,
		},
		Notifications: NotificationsConfig{
			Email: true,
		},
	}
}

// Validate enforces required config combinations.
func (c *Config) Validate() error {
	if c.Server.Port == 0 {
		return errors.New("server.port must be set")
	}
	if c.APIKeys.AnonymousPublic == "" {
		return errors.New("api_keys.anonymous_public must be set")
	}
	if c.Supabase.PooledDSN == "" && c.Supabase.DirectDSN == "" {
		return errors.New("supabase pooled_dsn or direct_dsn must be set")
	}
	if c.Redis.URL == "" {
		return errors.New("redis.url must be set")
	}
	if c.WorkOS.APIKey == "" {
		return errors.New("workos.api_key must be provided")
	}
	if c.WorkOS.ClientID == "" {
		return errors.New("workos.client_id must be provided")
	}
	return nil
}

// ServerAddress returns the address string for the primary HTTP server.
func (c *Config) ServerAddress() string {
	return fmt.Sprintf(":%d", c.Server.Port)
}

// MetricsAddress returns the address for the metrics server.
func (c *Config) MetricsAddress() string {
	return fmt.Sprintf(":%d", c.Server.MetricsPort)
}

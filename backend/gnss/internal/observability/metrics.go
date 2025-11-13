package observability

import (
	"log/slog"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// Metrics bundles Prometheus collectors used across the service.
type Metrics struct {
	ProviderLatency *prometheus.SummaryVec
	LimiterHits     *prometheus.CounterVec
	SchedulerHealth *prometheus.GaugeVec
}

// NewMetrics registers GNSS metrics under the provided namespace.
func NewMetrics(namespace string) *Metrics {
	m := &Metrics{
		ProviderLatency: promauto.NewSummaryVec(prometheus.SummaryOpts{
			Namespace: namespace,
			Name:      "provider_latency_seconds",
			Help:      "Latency of provider fetch operations",
		}, []string{"provider", "status"}),
		LimiterHits: promauto.NewCounterVec(prometheus.CounterOpts{
			Namespace: namespace,
			Name:      "limiter_total",
			Help:      "Count of limiter allow/deny decisions",
		}, []string{"tier"}),
		SchedulerHealth: promauto.NewGaugeVec(prometheus.GaugeOpts{
			Namespace: namespace,
			Name:      "scheduler_job_status",
			Help:      "Last-known success (1) or failure (0) for scheduler jobs",
		}, []string{"job"}),
	}
	return m
}

// MetricsHandler exposes Prometheus metrics using Gin.
func MetricsHandler() gin.HandlerFunc {
	handler := promhttp.Handler()
	return func(c *gin.Context) {
		handler.ServeHTTP(c.Writer, c.Request)
	}
}

// NewLogger configures slog for structured logging.
func NewLogger(format, env string) *slog.Logger {
	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}

	if env == "development" {
		opts.AddSource = true
	}

	var handler slog.Handler
	switch format {
	case "json":
		handler = slog.NewJSONHandler(os.Stdout, opts)
	default:
		handler = slog.NewTextHandler(os.Stdout, opts)
	}

	return slog.New(handler)
}

// RequestLogger is a gin middleware that logs request summaries.
func RequestLogger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		logger.Info("http_request",
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"duration_ms", time.Since(start).Milliseconds(),
		)
	}
}

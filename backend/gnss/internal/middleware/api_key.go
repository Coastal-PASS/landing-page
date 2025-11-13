package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/observability"
	redislimiter "github.com/Coastal-PASS/landing-page/backend/gnss/internal/redis"
	"github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// APIKeyMiddleware enforces anonymous API key checks + rate limiting tiers.
type APIKeyMiddleware struct {
	expectedKey string
	limiter     *redislimiter.SlidingWindowLimiter
	metrics     *observability.Metrics
}

// NewAPIKeyMiddleware wires the middleware.
func NewAPIKeyMiddleware(expected string, limiter *redislimiter.SlidingWindowLimiter, metrics *observability.Metrics) *APIKeyMiddleware {
	return &APIKeyMiddleware{
		expectedKey: strings.TrimSpace(expected),
		limiter:     limiter,
		metrics:     metrics,
	}
}

// Handler returns a gin middleware that validates `x-api-key`.
func (m *APIKeyMiddleware) Handler() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := RequestIDFromContext(c)
		key := strings.TrimSpace(c.GetHeader("x-api-key"))
		if key == "" || key != m.expectedKey {
			err := types.NewError(http.StatusUnauthorized, "auth.invalid_api_key", "Missing or invalid API key", nil, requestID)
			c.AbortWithStatusJSON(err.Status(), err)
			return
		}

		if m.limiter != nil {
			res, err := m.limiter.Allow(c.Request.Context(), "ratelimit:anon:"+key)
			if err != nil {
				errResp := types.NewError(http.StatusInternalServerError, "rate_limit.error", "Rate limiter failure", map[string]any{"error": err.Error()}, requestID)
				c.AbortWithStatusJSON(errResp.Status(), errResp)
				return
			}
			if m.metrics != nil {
				label := "allowed"
				if !res.Allowed {
					label = "throttled"
				}
				m.metrics.LimiterHits.WithLabelValues("anonymous_" + label).Inc()
			}
			if !res.Allowed {
				c.Header("Retry-After", res.RetryAfter.Round(time.Second).String())
				errResp := types.NewError(http.StatusTooManyRequests, "rate_limit.exceeded", "Anonymous rate limit exceeded", nil, requestID)
				c.AbortWithStatusJSON(errResp.Status(), errResp)
				return
			}
		}

		c.Set("client_tier", "anonymous")
		c.Next()
	}
}

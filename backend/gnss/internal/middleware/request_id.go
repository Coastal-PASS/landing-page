package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const requestIDKey = "request_id"

// RequestID ensures each request has a stable identifier used in logs/errors.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader("X-Request-Id")
		if id == "" {
			id = uuid.NewString()
		}
		c.Set(requestIDKey, id)
		c.Writer.Header().Set("X-Request-Id", id)
		c.Next()
	}
}

// RequestIDFromContext fetches the assigned ID or returns empty string.
func RequestIDFromContext(c *gin.Context) string {
	id, _ := c.Get(requestIDKey)
	if s, ok := id.(string); ok {
		return s
	}
	return ""
}

package redislimiter

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

const slidingWindowLua = `
local now_ms = tonumber(ARGV[1])
local window_ms = tonumber(ARGV[2])
local max_requests = tonumber(ARGV[3])
local window_start = now_ms - window_ms
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, window_start)
local current = redis.call('ZCARD', KEYS[1])
if current >= max_requests then
  local ttl = redis.call('PTTL', KEYS[1])
  return {0, ttl}
end
redis.call('ZADD', KEYS[1], now_ms, now_ms)
redis.call('PEXPIRE', KEYS[1], window_ms)
return {1, window_ms}
`

// Result describes a limiter evaluation.
type Result struct {
	Allowed    bool
	RetryAfter time.Duration
}

// SlidingWindowLimiter implements a Redis-backed sliding window limiter.
type SlidingWindowLimiter struct {
	client redis.Cmdable
	window time.Duration
	limit  int64
	script *redis.Script
}

// NewSlidingWindowLimiter constructs the limiter.
func NewSlidingWindowLimiter(client redis.Cmdable, window time.Duration, limit int64) *SlidingWindowLimiter {
	return &SlidingWindowLimiter{
		client: client,
		window: window,
		limit:  limit,
		script: redis.NewScript(slidingWindowLua),
	}
}

// Allow evaluates whether the provided key can proceed.
func (l *SlidingWindowLimiter) Allow(ctx context.Context, key string) (Result, error) {
	if l == nil {
		return Result{}, errors.New("limiter is nil")
	}

	now := time.Now().UnixMilli()
	raw, err := l.script.Run(ctx, l.client, []string{key}, now, l.window.Milliseconds(), l.limit).Result()
	if err != nil {
		return Result{}, fmt.Errorf("run limiter script: %w", err)
	}

	values, ok := raw.([]interface{})
	if !ok || len(values) != 2 {
		return Result{}, fmt.Errorf("unexpected redis response: %v", raw)
	}

	allowed := values[0].(int64) == 1
	ttl := time.Duration(values[1].(int64)) * time.Millisecond

	return Result{
		Allowed:    allowed,
		RetryAfter: ttl,
	}, nil
}

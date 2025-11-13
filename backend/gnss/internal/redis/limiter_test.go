package redislimiter

import (
	"context"
	"testing"
	"time"

	miniredis "github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
)

func TestSlidingWindowLimiter(t *testing.T) {
	mr, err := miniredis.Run()
	if err != nil {
		t.Fatalf("start miniredis: %v", err)
	}
	t.Cleanup(mr.Close)

	client := redis.NewClient(&redis.Options{Addr: mr.Addr()})

	limiter := NewSlidingWindowLimiter(client, time.Second, 2)

	ctx := context.Background()

	for i := 0; i < 2; i++ {
		res, err := limiter.Allow(ctx, "test:key")
		if err != nil {
			t.Fatalf("allow #%d failed: %v", i, err)
		}
		if !res.Allowed {
			t.Fatalf("expected request #%d to be allowed", i)
		}
	}

	res, err := limiter.Allow(ctx, "test:key")
	if err != nil {
		t.Fatalf("allow throttled request failed: %v", err)
	}
	if res.Allowed {
		t.Fatalf("expected request to be throttled")
	}
	if res.RetryAfter <= 0 {
		t.Fatalf("expected positive retry-after, got %v", res.RetryAfter)
	}
}

# Redis Sliding Window Cheatsheet

## Core Idea
- Sliding windows maintain a rolling interval (for example 60 seconds) and count only the requests that fall within the interval ending "now". This prevents the double-burst problem you get with fixed windows because the counter is trimmed every time a decision is made. Reference: https://redis.io/learn/develop/dotnet/aspnetcore/rate-limiting/sliding-window (“What is a Sliding Window Rate Limiter” section). 

## Redis Data Structures
- Use a Sorted Set per key (for example `ratelimit:{scope}:{key}`) where the score equals the request timestamp in milliseconds.
- Each evaluation performs:
  1. `ZREMRANGEBYSCORE key -inf (now - window)` — drop events older than the window.
  2. `ZCARD key` — count remaining requests.
  3. If below limit, `ZADD key now member` and optionally `PEXPIRE key window`.
- Commands execute via Lua (or a single MULTI block) to guarantee atomicity. Tutorial snippet: https://redis.io/learn/develop/dotnet/aspnetcore/rate-limiting/sliding-window (“Sliding Window Rate Limiter Lua Script”).

## Envelope for Go/Gin Middleware
1. Inject a Redis client with context deadlines to avoid blocking the HTTP handler.
2. Build limiter config (`window`, `maxRequests`, `identifierFactory`).
3. Middleware flow:
   - Build limiter key from route + API key or WorkOS org id.
   - Run Lua script, receiving `allowed` + `remaining` TTL.
   - Abort request with `429` when allowed flag is false; set `Retry-After` header to TTL ceil.
4. Export metrics (`allow_total`, `throttle_total`) so Prometheus/Grafana cover load.

## Operational Guardrails
- Keep keys localized (no spaces) to maximize Redis Cluster compatibility.
- Use Redis time (`TIME` command) if API hosts are skewed; the Redis tutorial recommends this to ensure consistent ordering across nodes.
- Rate limit tiers:
  - Anonymous/public GNSS endpoints: e.g., 60 req/min per IP.
  - Authenticated (WorkOS `org_id`): higher quotas + burst allowances.
- For batch/scheduler traffic, use different keys so UI queries do not throttle ingestion.


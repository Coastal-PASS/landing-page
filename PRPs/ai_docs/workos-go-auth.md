# WorkOS Go Auth Reference

## Key Docs
- Sessions overview and token handling: https://workos.com/docs/user-management/sessions/integrating-sessions/refresh-token (access token JWT contents, refresh workflow).
- WorkOS API reference (JWKS, logout endpoints, API base): https://workos.com/docs/reference.
- Go SDK guide + installation + latest release: https://workos.com/docs/sdks/go.
- Sessions API changelog (bulk revoke, audit) announced Aug 12 2025: https://workos.com/changelog/sessions-api.

## Access & Refresh Tokens
- Successful AuthKit sign-in yields `access_token` (short-lived JWT) and `refresh_token`. Store the access token in an `HttpOnly`, `Secure`, `SameSite=strict` cookie; keep refresh token server-side when possible to meet WorkOS guidance.
- Validate the access token on **every** backend call by fetching the JWKS for your environment: `https://api.workos.com/sso/jwks/{clientId}` (or custom AuthKit domain). Enforce issuer `iss=https://api.workos.com` (or your custom domain), verify `aud`/`client_id`, and pull `org_id`, `role`, and `permissions` claims for RBAC.
- Token refresh: when the JWT is expired, exchange the `refresh_token` using WorkOS Token endpoint; rotate both tokens and update secure storage.

## Go SDK Usage
```bash
go get -u github.com/workos/workos-go/...
```
```go
import (
  "context"
  "github.com/workos/workos-go/pkg/usermanagement"
)

client := usermanagement.NewClient("sk_live_xxx")
session, err := client.GetSession(context.Background(), usermanagement.GetSessionOpts{
  SessionID: "session_...",
})
```
- Prefer `workos-go v5.2.0` or newer (Oct 2 2025) for OrganizationMembership role data in Go structs.
- Middleware pattern: validate `Authorization: Bearer <token>` headers with `jose` or `github.com/golang-jwt/jwt/v5`, fetch WorkOS JWKS once and cache for 5 minutes.

## Sessions API & Logout
- Sessions API (Aug 12 2025) lets you list active sessions per user and revoke session IDs server-side—useful for `/api/v1/gnss/admin/sessions/purge`.
- Logout: call `/user_management/sessions/logout` with `session_id` + `return_to` or use SDK helper `GetLogoutUrlFromSessionCookie`. Always clear local cookies after WorkOS confirms logout.

## Implementation Checklist
1. **Server middleware** (Gin): extract bearer token, verify via JWKS, inject `WorkOSUser` struct (id, org_id, permissions, session_id).
2. **Org enforcement**: use `org_id` claim to scope Supabase queries (`saved_locations`, `alerts`).
3. **Session tiering**:
   - Anonymous: require signed API key header + Redis rate limiter.
   - Authenticated: require valid WorkOS session claims + optional org role check.
4. **Revocation hooks**: subscribe to WorkOS Events API (user disable, org membership revoked). Immediately delete Supabase refresh tokens and call Sessions API revoke.
5. **Testing**: add integration test that simulates expired JWT (should 401), invalid org_id (403), and revoked session (use Sessions API).

## Common Pitfalls
- Forgetting to refresh JWKS cache → token validation fails after WorkOS rotates signing keys.
- Using client-side storage for refresh tokens—violates WorkOS guidance and leaks into browser context.
- Not propagating `sid` claim → impossible to revoke individual sessions or show session history UI.

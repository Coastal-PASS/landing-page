package workos

import (
	"context"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/middleware"
	"github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// Validator validates WorkOS JWTs using cached JWKS keys.
type Validator struct {
	cfg         config.WorkOSConfig
	client      *http.Client
	keyCache    map[string]any
	cacheExpiry time.Time
	mu          sync.RWMutex
}

// NewValidator builds a WorkOS Validator.
func NewValidator(cfg config.WorkOSConfig) *Validator {
	return &Validator{
		cfg: cfg,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		keyCache: make(map[string]any),
	}
}

// Validate parses and validates the provided JWT.
func (v *Validator) Validate(ctx context.Context, token string) (*Claims, error) {
	if token == "" {
		return nil, errors.New("token missing")
	}
	parser := jwt.Parser{}
	parsed, err := parser.Parse(token, func(t *jwt.Token) (any, error) {
		if t.Method.Alg() != jwt.SigningMethodRS256.Alg() {
			return nil, fmt.Errorf("unexpected signing method %s", t.Method.Alg())
		}
		kid, _ := t.Header["kid"].(string)
		key, err := v.keyForKeyID(ctx, kid)
		if err != nil {
			return nil, err
		}
		return key, nil
	})
	if err != nil {
		return nil, fmt.Errorf("parse token: %w", err)
	}

	if !parsed.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("unexpected claims type")
	}

	if err := v.verifyStandardClaims(claims); err != nil {
		return nil, err
	}

	return &Claims{
		UserID:      fmt.Sprint(claims["sub"]),
		OrgID:       fmt.Sprint(claims["org_id"]),
		SessionID:   fmt.Sprint(claims["sid"]),
		Permissions: toStringSlice(claims["permissions"]),
		Roles:       toStringSlice(claims["roles"]),
		Email:       fmt.Sprint(claims["email"]),
	}, nil
}

func (v *Validator) verifyStandardClaims(claims jwt.MapClaims) error {
	if aud, ok := claims["aud"].(string); !ok || aud != v.cfg.ClientID {
		return fmt.Errorf("invalid audience")
	}
	if iss, ok := claims["iss"].(string); !ok || !strings.HasPrefix(iss, "https://") {
		return fmt.Errorf("invalid issuer")
	}
	if claims["org_id"] == nil {
		return fmt.Errorf("org_id missing")
	}
	return nil
}

func (v *Validator) keyForKeyID(ctx context.Context, kid string) (any, error) {
	v.mu.RLock()
	key, ok := v.keyCache[kid]
	expired := time.Now().After(v.cacheExpiry)
	v.mu.RUnlock()

	if ok && !expired {
		return key, nil
	}

	v.mu.Lock()
	defer v.mu.Unlock()
	if !expired {
		if key, ok := v.keyCache[kid]; ok {
			return key, nil
		}
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, v.cfg.JWKSURL, nil)
	if err != nil {
		return nil, fmt.Errorf("jwks request: %w", err)
	}
	resp, err := v.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch jwks: %w", err)
	}
	defer resp.Body.Close()

	var jwks jwksResponse
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return nil, fmt.Errorf("decode jwks: %w", err)
	}

	v.keyCache = make(map[string]any)
	for _, k := range jwks.Keys {
		if k.Kty != "RSA" {
			continue
		}
		pub, err := k.toPublicKey()
		if err != nil {
			continue
		}
		v.keyCache[k.Kid] = pub
	}
	v.cacheExpiry = time.Now().Add(v.cfg.CacheTTL)

	if key, ok := v.keyCache[kid]; ok {
		return key, nil
	}
	return nil, fmt.Errorf("kid %s not found", kid)
}

type jwksResponse struct {
	Keys []jsonWebKey `json:"keys"`
}

type jsonWebKey struct {
	Kty string `json:"kty"`
	Kid string `json:"kid"`
	N   string `json:"n"`
	E   string `json:"e"`
}

func (k jsonWebKey) toPublicKey() (any, error) {
	nb, err := base64.RawURLEncoding.DecodeString(k.N)
	if err != nil {
		return nil, err
	}
	eb, err := base64.RawURLEncoding.DecodeString(k.E)
	if err != nil {
		return nil, err
	}
	e := 0
	for _, b := range eb {
		e = e<<8 + int(b)
	}
	return &rsa.PublicKey{
		N: new(big.Int).SetBytes(nb),
		E: e,
	}, nil
}

func toStringSlice(value any) []string {
	arr, ok := value.([]any)
	if !ok {
		return nil
	}
	out := make([]string, 0, len(arr))
	for _, v := range arr {
		out = append(out, fmt.Sprint(v))
	}
	return out
}

// Middleware wires Validator into Gin.
type Middleware struct {
	validator  *Validator
	required   []string
	adminRoles map[string]struct{}
}

// NewMiddleware builds WorkOS middleware with RBAC expectations.
func NewMiddleware(validator *Validator, required []string, adminRoles []string) *Middleware {
	roleSet := make(map[string]struct{})
	for _, r := range adminRoles {
		roleSet[r] = struct{}{}
	}
	return &Middleware{
		validator:  validator,
		required:   required,
		adminRoles: roleSet,
	}
}

const claimsContextKey = "workos_claims"

// RequireSession validates bearer JWT and injects claims.
func (m *Middleware) RequireSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := middleware.RequestIDFromContext(c)
		token := extractBearer(c.GetHeader("Authorization"))
		claims, err := m.validator.Validate(c.Request.Context(), token)
		if err != nil {
			errResp := types.NewError(http.StatusUnauthorized, "auth.invalid_token", "Invalid WorkOS token", map[string]any{"error": err.Error()}, requestID)
			c.AbortWithStatusJSON(errResp.Status(), errResp)
			return
		}
		if len(m.required) > 0 {
			for _, reqPerm := range m.required {
				if !claims.HasPermission(reqPerm) {
					errResp := types.NewError(http.StatusForbidden, "auth.missing_permission", "Missing required permission", map[string]any{"permission": reqPerm}, requestID)
					c.AbortWithStatusJSON(errResp.Status(), errResp)
					return
				}
			}
		}
		c.Set(claimsContextKey, claims)
		c.Next()
	}
}

// RequireAdmin ensures the claim carries one of the configured admin roles.
func (m *Middleware) RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		val, exists := c.Get(claimsContextKey)
		if !exists {
			errResp := types.NewError(http.StatusUnauthorized, "auth.missing_claims", "Authentication required", nil, middleware.RequestIDFromContext(c))
			c.AbortWithStatusJSON(errResp.Status(), errResp)
			return
		}
		claims := val.(*Claims)
		for role := range m.adminRoles {
			if claims.HasRole(role) {
				c.Next()
				return
			}
		}
		errResp := types.NewError(http.StatusForbidden, "auth.missing_admin_role", "Administrator role required", nil, middleware.RequestIDFromContext(c))
		c.AbortWithStatusJSON(errResp.Status(), errResp)
	}
}

// ClaimsFromContext returns WorkOS claims.
func ClaimsFromContext(c *gin.Context) (*Claims, bool) {
	val, ok := c.Get(claimsContextKey)
	if !ok {
		return nil, false
	}
	claims, ok := val.(*Claims)
	return claims, ok
}

func extractBearer(header string) string {
	if header == "" {
		return ""
	}
	parts := strings.SplitN(header, " ", 2)
	if len(parts) != 2 {
		return ""
	}
	if !strings.EqualFold(parts[0], "Bearer") {
		return ""
	}
	return parts[1]
}

package workos

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"encoding/base64"
	"math/big"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
)

func TestExtractBearer(t *testing.T) {
	token := extractBearer("Bearer abc")
	if token != "abc" {
		t.Fatalf("expected bearer token, got %s", token)
	}
	if token := extractBearer("invalid"); token != "" {
		t.Fatalf("expected empty token for invalid header")
	}
}

func TestKeyCaching(t *testing.T) {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatalf("generate key: %v", err)
	}
	pub := priv.PublicKey
	eBytes := new(big.Int).SetInt64(int64(pub.E)).Bytes()
	jwks := `{"keys":[{"kty":"RSA","kid":"kid1","n":"` + base64.RawURLEncoding.EncodeToString(pub.N.Bytes()) + `","e":"` + base64.RawURLEncoding.EncodeToString(eBytes) + `"}]}`

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(jwks))
	}))
	t.Cleanup(server.Close)

	cfg := config.WorkOSConfig{
		ClientID: "client",
		JWKSURL:  server.URL,
		CacheTTL: time.Minute,
	}
	validator := NewValidator(cfg)

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"aud":         "client",
		"iss":         "https://api.workos.com",
		"org_id":      "org",
		"sub":         "user",
		"sid":         "session",
		"roles":       []string{"admin"},
		"permissions": []string{"gnss:read"},
	})
	jwtToken.Header["kid"] = "kid1"
	signed, err := jwtToken.SignedString(priv)
	if err != nil {
		t.Fatalf("sign token: %v", err)
	}

	if _, err := validator.Validate(context.Background(), signed); err != nil {
		t.Fatalf("validate token: %v", err)
	}
}

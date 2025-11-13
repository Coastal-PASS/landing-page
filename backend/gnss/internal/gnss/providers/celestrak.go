package providers

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"sync"
	"time"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// CelesTrakClient fetches public TLE feeds.
type CelesTrakClient struct {
	baseURL string
	client  *http.Client

	mu          sync.RWMutex
	lastErr     string
	lastStatus  string
	lastSuccess time.Time
}

// NewCelesTrakClient builds the client.
func NewCelesTrakClient(cfg config.CelesTrakConfig) *CelesTrakClient {
	return &CelesTrakClient{
		baseURL: cfg.BaseURL,
		client: &http.Client{
			Timeout: cfg.Timeout,
		},
		lastStatus: "unknown",
	}
}

func (c *CelesTrakClient) Name() string {
	return "celestrak"
}

// FetchTLE downloads TLE data for the provided NORAD IDs or falls back to
// active catalog.
func (c *CelesTrakClient) FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error) {
	fetchURL, err := c.buildURL(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, fetchURL, nil)
	if err != nil {
		return nil, err
	}
	resp, err := c.client.Do(httpReq)
	if err != nil {
		c.recordStatus("down", err.Error())
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		err = fmt.Errorf("celestrak status %d: %s", resp.StatusCode, string(body))
		c.recordStatus("degraded", err.Error())
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.recordStatus("degraded", err.Error())
		return nil, err
	}
	records, err := parseTLEBody(string(body), c.Name())
	if err != nil {
		c.recordStatus("degraded", err.Error())
		return nil, err
	}
	c.recordStatus("healthy", "")
	return records, nil
}

func (c *CelesTrakClient) recordStatus(status, message string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.lastStatus = status
	c.lastErr = message
	if status == "healthy" {
		c.lastSuccess = time.Now()
	}
}

func (c *CelesTrakClient) buildURL(req TLERequest) (string, error) {
	base, err := url.Parse(c.baseURL)
	if err != nil {
		return "", err
	}
	if len(req.NORADIDs) > 0 {
		base.Path = "/satcat/tle.php"
		q := base.Query()
		q.Set("CATNR", strconv.Itoa(req.NORADIDs[0]))
		base.RawQuery = q.Encode()
		return base.String(), nil
	}
	base.Path = "/NORAD/elements/gp.php"
	q := base.Query()
	q.Set("GROUP", "active")
	q.Set("FORMAT", "tle")
	base.RawQuery = q.Encode()
	return base.String(), nil
}

// Health returns the last-known provider state.
func (c *CelesTrakClient) Health(ctx context.Context) apptypes.ProviderHealth {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return apptypes.ProviderHealth{
		Provider:    c.Name(),
		Status:      c.lastStatus,
		LastSuccess: c.lastSuccess,
		LastError:   c.lastErr,
		UpdatedAt:   time.Now(),
	}
}

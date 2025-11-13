package providers

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// SpaceTrackClient fetches authenticated TLE feeds from Space-Track.
type SpaceTrackClient struct {
	cfg           config.SpaceTrackConfig
	client        *http.Client
	authenticated bool
	mu            sync.Mutex

	lastStatus  string
	lastErr     string
	lastSuccess time.Time
}

// NewSpaceTrackClient constructs the client.
func NewSpaceTrackClient(cfg config.SpaceTrackConfig) *SpaceTrackClient {
	jar, _ := cookiejar.New(nil)
	return &SpaceTrackClient{
		cfg:    cfg,
		client: &http.Client{Timeout: cfg.Timeout, Jar: jar},
	}
}

func (c *SpaceTrackClient) Name() string {
	return "space_track"
}

func (c *SpaceTrackClient) ensureSession(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.authenticated {
		return nil
	}
	if c.cfg.Username == "" || c.cfg.Password == "" {
		return fmt.Errorf("space-track credentials missing")
	}
	loginURL := c.cfg.BaseURL + "/ajaxauth/login"
	form := url.Values{}
	form.Set("identity", c.cfg.Username)
	form.Set("password", c.cfg.Password)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, loginURL, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := c.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("space-track login failed: %s", string(body))
	}
	c.authenticated = true
	return nil
}

// FetchTLE pulls the latest TLE entries.
func (c *SpaceTrackClient) FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error) {
	if err := c.ensureSession(ctx); err != nil {
		c.recordStatus("degraded", err.Error())
		return nil, err
	}
	query := c.buildQuery(req)
	fullURL := fmt.Sprintf("%s/%s", strings.TrimSuffix(c.cfg.BaseURL, "/"), query)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, fullURL, nil)
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
		err = fmt.Errorf("space-track error %d: %s", resp.StatusCode, string(body))
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

func (c *SpaceTrackClient) buildQuery(req TLERequest) string {
	limit := req.Limit
	if limit == 0 {
		limit = 10
	}
	parts := []string{
		"basicspacedata/query/class/tle_latest",
		"ORDINAL/1",
		fmt.Sprintf("limit/%d", limit),
		"format/tle",
	}
	if len(req.NORADIDs) > 0 {
		parts = append(parts, fmt.Sprintf("NORAD_CAT_ID/%d", req.NORADIDs[0]))
	}
	return strings.Join(parts, "/")
}

func (c *SpaceTrackClient) recordStatus(status, message string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.lastStatus = status
	c.lastErr = message
	if status == "healthy" {
		c.lastSuccess = time.Now()
	}
}

// Health reports Space-Track availability.
func (c *SpaceTrackClient) Health(ctx context.Context) apptypes.ProviderHealth {
	c.mu.Lock()
	defer c.mu.Unlock()
	return apptypes.ProviderHealth{
		Provider:    c.Name(),
		Status:      c.lastStatus,
		LastError:   c.lastErr,
		LastSuccess: c.lastSuccess,
		UpdatedAt:   time.Now(),
	}
}

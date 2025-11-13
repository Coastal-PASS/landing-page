package providers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// N2YOClient fetches TLE data via the N2YO REST API.
type N2YOClient struct {
	apiKey string
	base   string
	client *http.Client

	mu          sync.Mutex
	lastStatus  string
	lastErr     string
	lastSuccess time.Time
}

// NewN2YOClient creates the client.
func NewN2YOClient(cfg config.N2YOConfig) *N2YOClient {
	return &N2YOClient{
		apiKey: cfg.APIKey,
		base:   strings.TrimSuffix(cfg.BaseURL, "/"),
		client: &http.Client{Timeout: cfg.Timeout},
	}
}

func (c *N2YOClient) Name() string {
	return "n2yo"
}

// FetchTLE returns TLE data for the first requested NORAD id.
func (c *N2YOClient) FetchTLE(ctx context.Context, req TLERequest) ([]TLERecord, error) {
	if c.apiKey == "" {
		return nil, fmt.Errorf("n2yo api key missing")
	}
	if len(req.NORADIDs) == 0 {
		return nil, fmt.Errorf("n2yo requires at least one NORAD id")
	}
	url := fmt.Sprintf("%s/tle/%d&apiKey=%s", c.base, req.NORADIDs[0], c.apiKey)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
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
		err = fmt.Errorf("n2yo error %d: %s", resp.StatusCode, string(body))
		c.recordStatus("degraded", err.Error())
		return nil, err
	}
	var payload n2yoResponse
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		c.recordStatus("degraded", err.Error())
		return nil, err
	}
	records, err := parseTLEBody(payload.TLE, c.Name())
	if err != nil {
		c.recordStatus("degraded", err.Error())
		return nil, err
	}
	c.recordStatus("healthy", "")
	return records, nil
}

func (c *N2YOClient) recordStatus(status, message string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.lastStatus = status
	c.lastErr = message
	if status == "healthy" {
		c.lastSuccess = time.Now()
	}
}

// Health describes the latest fetch result.
func (c *N2YOClient) Health(ctx context.Context) apptypes.ProviderHealth {
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

type n2yoResponse struct {
	Info struct {
		Satname string `json:"satname"`
		Satid   int    `json:"satid"`
	} `json:"info"`
	TLE string `json:"tle"`
}

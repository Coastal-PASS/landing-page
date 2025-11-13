package services

import (
	"context"
	"fmt"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// NotificationService delivers alerts via SendGrid.
type NotificationService struct {
	client    *sendgrid.Client
	from      string
	enabled   bool
	rateLimit time.Duration
	lastSend  time.Time
}

// NewNotificationService creates a SendGrid-backed notifier.
func NewNotificationService(apiKey, from string, enabled bool) *NotificationService {
	var client *sendgrid.Client
	if apiKey != "" {
		client = sendgrid.NewSendClient(apiKey)
	}
	return &NotificationService{
		client:    client,
		from:      from,
		enabled:   enabled && apiKey != "",
		rateLimit: time.Second,
	}
}

// Send emails the provided payload if enabled.
func (s *NotificationService) Send(ctx context.Context, to, subject, body string) error {
	if !s.enabled {
		return nil
	}
	if time.Since(s.lastSend) < s.rateLimit {
		time.Sleep(s.rateLimit - time.Since(s.lastSend))
	}
	message := mail.NewSingleEmail(
		mail.NewEmail("CoastalPASS GNSS", s.from),
		subject,
		mail.NewEmail("", to),
		body,
		body,
	)
	resp, err := s.client.SendWithContext(ctx, message)
	if err != nil {
		return fmt.Errorf("sendgrid send: %w", err)
	}
	if resp.StatusCode >= 400 {
		return fmt.Errorf("sendgrid error: %s", resp.Body)
	}
	s.lastSend = time.Now()
	return nil
}

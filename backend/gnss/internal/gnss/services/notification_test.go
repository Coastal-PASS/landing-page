package services

import (
	"context"
	"testing"
)

func TestNotificationDisabled(t *testing.T) {
	service := NewNotificationService("", "from@example.com", true)
	if err := service.Send(context.Background(), "user@example.com", "Subject", "Body"); err != nil {
		t.Fatalf("expected no error when disabled, got %v", err)
	}
}

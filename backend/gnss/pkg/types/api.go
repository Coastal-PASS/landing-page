package types

import (
	"net/http"
)

// Envelope is the standard JSON envelope for successful responses.
type Envelope[T any] struct {
	Data T        `json:"data"`
	Meta Metadata `json:"meta,omitempty"`
}

// Metadata carries optional pagination or context fields.
type Metadata map[string]any

// ErrorResponse represents the error schema shared across handlers.
type ErrorResponse struct {
	Code      string         `json:"code"`
	Message   string         `json:"message"`
	Details   map[string]any `json:"details,omitempty"`
	RequestID string         `json:"request_id"`
	status    int
}

// NewError builds a typed HTTP error response.
func NewError(status int, code, message string, details map[string]any, requestID string) ErrorResponse {
	return ErrorResponse{
		Code:      code,
		Message:   message,
		Details:   details,
		RequestID: requestID,
		status:    status,
	}
}

// Status returns the HTTP status code to emit.
func (e ErrorResponse) Status() int {
	if e.status == 0 {
		return http.StatusInternalServerError
	}
	return e.status
}

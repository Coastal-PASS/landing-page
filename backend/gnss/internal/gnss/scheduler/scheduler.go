package scheduler

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
)

// Job defines a recurring background task.
type Job interface {
	ID() string
	Interval() time.Duration
	Run(ctx context.Context) error
}

// Scheduler orchestrates recurring jobs and persists results to Supabase.
type Scheduler struct {
	db     services.DB
	logger *slog.Logger

	jobs []Job
	wg   sync.WaitGroup
	stop chan struct{}
}

// New constructs a Scheduler.
func New(db services.DB, logger *slog.Logger, jobs []Job) *Scheduler {
	return &Scheduler{
		db:     db,
		logger: logger,
		jobs:   jobs,
		stop:   make(chan struct{}),
	}
}

// Start launches job goroutines.
func (s *Scheduler) Start(ctx context.Context) {
	for _, job := range s.jobs {
		job := job
		s.wg.Add(1)
		go func() {
			defer s.wg.Done()
			ticker := time.NewTicker(job.Interval())
			defer ticker.Stop()
			for {
				select {
				case <-ticker.C:
					s.runJob(ctx, job)
				case <-s.stop:
					return
				case <-ctx.Done():
					return
				}
			}
		}()
	}
}

// Trigger executes a job immediately.
func (s *Scheduler) Trigger(ctx context.Context, id string) error {
	for _, job := range s.jobs {
		if job.ID() == id {
			return s.runJob(ctx, job)
		}
	}
	return fmt.Errorf("job %s not found", id)
}

// Stop stops all job goroutines.
func (s *Scheduler) Stop() {
	close(s.stop)
	s.wg.Wait()
}

func (s *Scheduler) runJob(ctx context.Context, job Job) error {
	start := time.Now()
	err := job.Run(ctx)
	duration := time.Since(start)
	status := "success"
	message := ""
	if err != nil {
		status = "error"
		message = err.Error()
		s.logger.Error("scheduler job failed", "job", job.ID(), "error", err, "duration", duration)
	} else {
		s.logger.Info("scheduler job complete", "job", job.ID(), "duration", duration)
	}
	_, execErr := s.db.Exec(ctx, `
		INSERT INTO scheduler_jobs (id, last_run_status, last_error, updated_at)
		VALUES ($1,$2,$3,now())
		ON CONFLICT (id) DO UPDATE SET last_run_status = EXCLUDED.last_run_status, last_error = EXCLUDED.last_error, updated_at = now()
	`, job.ID(), status, message)
	if execErr != nil {
		s.logger.Error("failed to persist scheduler status", "job", job.ID(), "error", execErr)
	}
	return err
}

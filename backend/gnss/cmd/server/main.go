package main

import (
	"context"
	"flag"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/config"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/database"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/api"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/calculations"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/providers"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/scheduler"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/middleware"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/observability"
	redislimiter "github.com/Coastal-PASS/landing-page/backend/gnss/internal/redis"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/workos"
)

func main() {
	var configPath string
	flag.StringVar(&configPath, "config", "", "Path to config YAML")
	flag.Parse()

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	cfg, err := config.Load(configPath)
	if err != nil {
		panic(err)
	}

	logger := observability.NewLogger(cfg.Observability.LogFormat, cfg.Env)

	dbPool, err := database.NewTimescalePool(ctx, cfg.Supabase)
	if err != nil {
		logger.Error("failed to connect to database", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer dbPool.Close()

	redisOpts, err := redis.ParseURL(cfg.Redis.URL)
	if err != nil {
		logger.Error("invalid redis url", slog.String("error", err.Error()))
		os.Exit(1)
	}
	redisClient := redis.NewClient(redisOpts)
	defer redisClient.Close()

	metrics := observability.NewMetrics(cfg.Observability.PromNamespace)

	providerManager := providers.NewManager(
		providers.NewSpaceTrackClient(cfg.Providers.SpaceTrack),
		providers.NewCelesTrakClient(cfg.Providers.CelesTrak),
		providers.NewN2YOClient(cfg.Providers.N2YO),
		providers.NewTimescaleProvider(dbPool),
	)

	engine := calculations.NewEngine(providerManager, dbPool)
	locationSvc := services.NewLocationService(dbPool)
	alertSvc := services.NewAlertService(dbPool)
	notificationSvc := services.NewNotificationService(cfg.Email.SendGridAPIKey, cfg.Email.FromAddress, cfg.Notifications.Email)

	var jobs []scheduler.Job
	if cfg.Scheduler.Enabled {
		jobs = append(jobs,
			scheduler.NewTLERefreshJob(providerManager, dbPool, cfg.Scheduler.RefreshTLEInterval),
			scheduler.NewTecRefreshJob(dbPool, cfg.Scheduler.RefreshTECInterval),
			scheduler.NewAlertEvaluationJob(alertSvc, engine, notificationSvc, dbPool, cfg.Scheduler.EvaluateAlertsInterval),
		)
	}
	var sched *scheduler.Scheduler
	if len(jobs) > 0 {
		sched = scheduler.New(dbPool, logger, jobs)
		go sched.Start(ctx)
		defer sched.Stop()
	}

	limiter := redislimiter.NewSlidingWindowLimiter(redisClient, time.Duration(cfg.RateLimit.WindowSeconds)*time.Second, cfg.RateLimit.AnonymousPerMinute)
	apiKey := middleware.NewAPIKeyMiddleware(cfg.APIKeys.AnonymousPublic, limiter, metrics)

	workosValidator := workos.NewValidator(cfg.WorkOS)
	workosMiddleware := workos.NewMiddleware(workosValidator, cfg.WorkOS.RequiredPermissions, cfg.WorkOS.AdminRoles)

	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New()
	router.Use(gin.Recovery(), middleware.RequestID(), observability.RequestLogger(logger))

	api.Register(router, api.Dependencies{
		Engine:          engine,
		ProviderManager: providerManager,
		Locations:       locationSvc,
		Alerts:          alertSvc,
		Scheduler:       sched,
		APIKeyAuth:      apiKey,
		WorkOS:          workosMiddleware,
	})

	metricsRouter := gin.New()
	metricsRouter.GET("/metrics", observability.MetricsHandler())
	metricsServer := &http.Server{
		Addr:    cfg.MetricsAddress(),
		Handler: metricsRouter,
	}
	go func() {
		if err := metricsServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("metrics server error", slog.String("error", err.Error()))
		}
	}()
	defer metricsServer.Shutdown(context.Background())

	server := &http.Server{
		Addr:         cfg.ServerAddress(),
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	go func() {
		logger.Info("server starting", slog.String("addr", cfg.ServerAddress()))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("server error", slog.String("error", err.Error()))
			cancel()
		}
	}()

	<-ctx.Done()
	ctxShutdown, cancelShutdown := context.WithTimeout(context.Background(), cfg.Server.ShutdownGracePeriod)
	defer cancelShutdown()
	_ = server.Shutdown(ctxShutdown)
}

package api

import (
	"github.com/gin-gonic/gin"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/calculations"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/providers"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/scheduler"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/middleware"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/workos"
)

// Dependencies aggregates the services needed by HTTP handlers.
type Dependencies struct {
	Engine          *calculations.Engine
	ProviderManager *providers.Manager
	Locations       *services.LocationService
	Alerts          *services.AlertService
	Scheduler       *scheduler.Scheduler
	APIKeyAuth      *middleware.APIKeyMiddleware
	WorkOS          *workos.Middleware
}

// Register attaches GNSS routes to the router.
func Register(router *gin.Engine, deps Dependencies) {
	handler := &Handler{
		engine:    deps.Engine,
		providers: deps.ProviderManager,
		locations: deps.Locations,
		alerts:    deps.Alerts,
		scheduler: deps.Scheduler,
	}

	api := router.Group("/api/v1/gnss")
	api.GET("/health", handler.Health)
	api.GET("/providers", handler.ProviderStatus)

	if deps.APIKeyAuth != nil {
		api.GET("/visibility", deps.APIKeyAuth.Handler(), handler.Visibility)
		api.GET("/tec", deps.APIKeyAuth.Handler(), handler.Tec)
		api.GET("/dop", deps.APIKeyAuth.Handler(), handler.DOP)
	} else {
		api.GET("/visibility", handler.Visibility)
		api.GET("/tec", handler.Tec)
		api.GET("/dop", handler.DOP)
	}

	if deps.WorkOS != nil {
		protected := api.Group("/")
		protected.Use(deps.WorkOS.RequireSession())

		protected.GET("/locations", handler.ListLocations)
		protected.POST("/locations", handler.CreateLocation)
		protected.PUT("/locations/:id", handler.UpdateLocation)
		protected.DELETE("/locations/:id", handler.DeleteLocation)

		protected.GET("/alerts", handler.ListAlerts)
		protected.POST("/alerts", deps.WorkOS.RequireAdmin(), handler.CreateAlert)
		protected.PUT("/alerts/:id", deps.WorkOS.RequireAdmin(), handler.UpdateAlert)
		protected.DELETE("/alerts/:id", deps.WorkOS.RequireAdmin(), handler.DeleteAlert)

		protected.POST("/admin/batch/trigger/:job", deps.WorkOS.RequireAdmin(), handler.TriggerJob)
		protected.GET("/status", handler.SchedulerStatus)
	}
}

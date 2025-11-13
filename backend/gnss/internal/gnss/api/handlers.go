package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/calculations"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/providers"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/scheduler"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/services"
	gnsstypes "github.com/Coastal-PASS/landing-page/backend/gnss/internal/gnss/types"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/middleware"
	"github.com/Coastal-PASS/landing-page/backend/gnss/internal/workos"
	apptypes "github.com/Coastal-PASS/landing-page/backend/gnss/pkg/types"
)

// Handler bundles dependencies for HTTP handlers.
type Handler struct {
	engine    *calculations.Engine
	providers *providers.Manager
	locations *services.LocationService
	alerts    *services.AlertService
	scheduler *scheduler.Scheduler
}

// Health handler.
func (h *Handler) Health(c *gin.Context) {
	status := h.providers.Health(c.Request.Context())
	respond(c, http.StatusOK, gin.H{"status": "ok", "providers": status})
}

// Visibility handler.
func (h *Handler) Visibility(c *gin.Context) {
	query, err := parseVisibilityQuery(c)
	if err != nil {
		abortError(c, http.StatusBadRequest, "visibility.invalid_params", err.Error())
		return
	}
	resp, err := h.engine.Visibility(c.Request.Context(), query)
	if err != nil {
		abortError(c, http.StatusBadGateway, "visibility.failed", err.Error())
		return
	}
	respond(c, http.StatusOK, resp)
}

func (h *Handler) Tec(c *gin.Context) {
	window, _ := strconv.Atoi(c.DefaultQuery("window_minutes", "30"))
	resp, err := h.engine.TecHeatmap(c.Request.Context(), gnsstypes.TecQuery{
		WindowMinutes: window,
	})
	if err != nil {
		abortError(c, http.StatusBadGateway, "tec.failed", err.Error())
		return
	}
	respond(c, http.StatusOK, resp)
}

func (h *Handler) DOP(c *gin.Context) {
	query, err := parseDopQuery(c)
	if err != nil {
		abortError(c, http.StatusBadRequest, "dop.invalid_params", err.Error())
		return
	}
	resp, err := h.engine.DOP(c.Request.Context(), query)
	if err != nil {
		abortError(c, http.StatusBadGateway, "dop.failed", err.Error())
		return
	}
	respond(c, http.StatusOK, resp)
}

func (h *Handler) ProviderStatus(c *gin.Context) {
	respond(c, http.StatusOK, h.providers.Health(c.Request.Context()))
}

func (h *Handler) ListLocations(c *gin.Context) {
	claims, ok := workos.ClaimsFromContext(c)
	if !ok {
		abortError(c, http.StatusUnauthorized, "auth.missing_claims", "missing workos claims")
		return
	}
	locations, err := h.locations.List(c.Request.Context(), claims.OrgID)
	if err != nil {
		abortError(c, http.StatusInternalServerError, "locations.fetch_failed", err.Error())
		return
	}
	respond(c, http.StatusOK, locations)
}

func (h *Handler) CreateLocation(c *gin.Context) {
	claims, ok := workos.ClaimsFromContext(c)
	if !ok {
		abortError(c, http.StatusUnauthorized, "auth.missing_claims", "missing workos claims")
		return
	}
	var payload gnsstypes.LocationPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		abortError(c, http.StatusBadRequest, "locations.invalid_body", err.Error())
		return
	}
	loc, err := h.locations.Create(c.Request.Context(), claims.OrgID, claims.UserID, payload)
	if err != nil {
		abortError(c, http.StatusInternalServerError, "locations.create_failed", err.Error())
		return
	}
	respond(c, http.StatusCreated, loc)
}

func (h *Handler) UpdateLocation(c *gin.Context) {
	claims, ok := workos.ClaimsFromContext(c)
	if !ok {
		abortError(c, http.StatusUnauthorized, "auth.missing_claims", "missing workos claims")
		return
	}
	var payload gnsstypes.LocationPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		abortError(c, http.StatusBadRequest, "locations.invalid_body", err.Error())
		return
	}
	update := services.LocationUpdate{}
	if payload.Name != "" {
		update.Name = &payload.Name
	}
	if payload.Latitude != 0 {
		update.Latitude = &payload.Latitude
	}
	if payload.Longitude != 0 {
		update.Longitude = &payload.Longitude
	}
	if payload.ElevationM != 0 {
		update.ElevationM = &payload.ElevationM
	}
	loc, err := h.locations.Update(c.Request.Context(), claims.OrgID, c.Param("id"), update)
	if err != nil {
		abortError(c, http.StatusInternalServerError, "locations.update_failed", err.Error())
		return
	}
	respond(c, http.StatusOK, loc)
}

func (h *Handler) DeleteLocation(c *gin.Context) {
	claims, ok := workos.ClaimsFromContext(c)
	if !ok {
		abortError(c, http.StatusUnauthorized, "auth.missing_claims", "missing workos claims")
		return
	}
	if err := h.locations.Delete(c.Request.Context(), claims.OrgID, c.Param("id")); err != nil {
		abortError(c, http.StatusNotFound, "locations.delete_failed", err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) ListAlerts(c *gin.Context) {
	claims, ok := workos.ClaimsFromContext(c)
	if !ok {
		abortError(c, http.StatusUnauthorized, "auth.missing_claims", "missing workos claims")
		return
	}
	status := c.Query("status")
	rules, err := h.alerts.List(c.Request.Context(), claims.OrgID, status)
	if err != nil {
		abortError(c, http.StatusInternalServerError, "alerts.fetch_failed", err.Error())
		return
	}
	respond(c, http.StatusOK, rules)
}

func (h *Handler) CreateAlert(c *gin.Context) {
	claims, _ := workos.ClaimsFromContext(c)
	var payload gnsstypes.AlertPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		abortError(c, http.StatusBadRequest, "alerts.invalid_body", err.Error())
		return
	}
	rule, err := h.alerts.Create(c.Request.Context(), claims.OrgID, claims.UserID, payload)
	if err != nil {
		abortError(c, http.StatusInternalServerError, "alerts.create_failed", err.Error())
		return
	}
	respond(c, http.StatusCreated, rule)
}

func (h *Handler) UpdateAlert(c *gin.Context) {
	claims, _ := workos.ClaimsFromContext(c)
	var payload gnsstypes.AlertPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		abortError(c, http.StatusBadRequest, "alerts.invalid_body", err.Error())
		return
	}
	rule, err := h.alerts.Update(c.Request.Context(), claims.OrgID, c.Param("id"), payload)
	if err != nil {
		abortError(c, http.StatusInternalServerError, "alerts.update_failed", err.Error())
		return
	}
	respond(c, http.StatusOK, rule)
}

func (h *Handler) DeleteAlert(c *gin.Context) {
	claims, _ := workos.ClaimsFromContext(c)
	if err := h.alerts.Delete(c.Request.Context(), claims.OrgID, c.Param("id")); err != nil {
		abortError(c, http.StatusNotFound, "alerts.delete_failed", err.Error())
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) SchedulerStatus(c *gin.Context) {
	if h.scheduler == nil {
		respond(c, http.StatusOK, gin.H{"jobs": []string{}})
		return
	}
	respond(c, http.StatusOK, gin.H{"jobs": []string{"refresh_tle", "refresh_tec", "evaluate_alerts"}})
}

func (h *Handler) TriggerJob(c *gin.Context) {
	if h.scheduler == nil {
		abortError(c, http.StatusServiceUnavailable, "scheduler.unconfigured", "scheduler not enabled")
		return
	}
	if err := h.scheduler.Trigger(c.Request.Context(), c.Param("job")); err != nil {
		abortError(c, http.StatusBadRequest, "scheduler.trigger_failed", err.Error())
		return
	}
	respond(c, http.StatusAccepted, gin.H{"status": "queued"})
}

func parseVisibilityQuery(c *gin.Context) (gnsstypes.VisibilityQuery, error) {
	lat, err := strconv.ParseFloat(c.Query("lat"), 64)
	if err != nil {
		return gnsstypes.VisibilityQuery{}, err
	}
	lon, err := strconv.ParseFloat(c.Query("lon"), 64)
	if err != nil {
		return gnsstypes.VisibilityQuery{}, err
	}
	elev := parseFloatDefault(c.DefaultQuery("elevation_m", "0"))
	return gnsstypes.VisibilityQuery{
		Latitude:   lat,
		Longitude:  lon,
		ElevationM: elev,
	}, nil
}

func parseDopQuery(c *gin.Context) (gnsstypes.DopQuery, error) {
	lat, err := strconv.ParseFloat(c.Query("lat"), 64)
	if err != nil {
		return gnsstypes.DopQuery{}, err
	}
	lon, err := strconv.ParseFloat(c.Query("lon"), 64)
	if err != nil {
		return gnsstypes.DopQuery{}, err
	}
	elev := parseFloatDefault(c.DefaultQuery("elevation_m", "0"))
	window, _ := strconv.Atoi(c.DefaultQuery("window_minutes", "30"))
	return gnsstypes.DopQuery{
		Latitude:      lat,
		Longitude:     lon,
		ElevationM:    elev,
		WindowMinutes: window,
	}, nil
}

func parseFloatDefault(value string) float64 {
	f, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return 0
	}
	return f
}

func respond(c *gin.Context, status int, data any) {
	c.JSON(status, apptypes.Envelope[any]{Data: data})
}

func abortError(c *gin.Context, status int, code string, message string) {
	requestID := middleware.RequestIDFromContext(c)
	err := apptypes.NewError(status, code, message, nil, requestID)
	c.AbortWithStatusJSON(status, err)
}

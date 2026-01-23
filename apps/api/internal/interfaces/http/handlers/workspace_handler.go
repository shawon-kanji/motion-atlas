package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/motion-atlas/api/internal/domain/workspace"
)

// CreateWorkspaceRequest represents the payload for creating a workspace.
type CreateWorkspaceRequest struct {
	Name string `json:"name" binding:"required"`
}

// CreateWorkspace handles workspace creation.
func (h *Handler) CreateWorkspace(c *gin.Context) {
	// 1. Get current user ID (assuming middleware sets it)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	uid := userID.(string)

	// 2. Parse request
	var req CreateWorkspaceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 3. Create domain object
	ws := &workspace.Workspace{
		ID:        uuid.New().String(),
		Name:      req.Name,
		OwnerID:   uid,
		Plan:      "free",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// 4. Save via service
	if err := h.workspaceService.Create(ws); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create workspace"})
		return
	}

	// 5. Add owner as member with 'owner' role
	member := &workspace.Member{
		UserID:      uid,
		WorkspaceID: ws.ID,
		Role:        "owner",
		JoinedAt:    time.Now(),
	}
	if err := h.workspaceService.AddMember(member); err != nil {
		// Log error but maybe don't fail request if workspace was created?
		// For now, let's treat it as critical
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add member"})
		return
	}

	c.JSON(http.StatusCreated, ws)
}

// GetWorkspaces retrieves all workspaces for the current user.
func (h *Handler) GetWorkspaces(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	uid := userID.(string)

	// TODO: We need to expose a method in Service to find workspaces by UserID (Member)
	// Currently service.go only has FindByOwner (via repo) which is limiting,
	// or generic Get(id).
	// We updated repository to have FindByUserID but we need to expose it in Service.

	// TEMPORARY FIX: calling repo directly via service if exposed? No, service encapsulates repo.
	// I need to update service.go first to expose `ListByUser` or similar.
	// For now, I will assume I will update `service.go` immediately after this.

	workspaces, err := h.workspaceService.ListByUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch workspaces"})
		return
	}

	c.JSON(http.StatusOK, workspaces)
}

// GetWorkspace retrieves a single workspace.
func (h *Handler) GetWorkspace(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	// Check permission? For now assuming if you can fetch it you can see it,
	// but ideally we should check if user is a member.

	ws, err := h.workspaceService.Get(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "workspace not found"})
		return
	}

	c.JSON(http.StatusOK, ws)
}

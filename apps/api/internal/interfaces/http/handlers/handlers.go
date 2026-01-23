// Package handlers contains HTTP handler functions.
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	assetService "github.com/motion-atlas/api/internal/application/asset"
	userService "github.com/motion-atlas/api/internal/application/user"
	workspaceService "github.com/motion-atlas/api/internal/application/workspace"
)

// Handler holds dependencies for HTTP handlers.
type Handler struct {
	userService      *userService.Service
	assetService     *assetService.Service
	workspaceService *workspaceService.Service
}

// NewHandler creates a new Handler with dependencies.
func NewHandler(us *userService.Service, as *assetService.Service, ws *workspaceService.Service) *Handler {
	return &Handler{
		userService:      us,
		assetService:     as,
		workspaceService: ws,
	}
}

// Health returns service health status.
func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// SignupRequest represents the signup request body.
type SignupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

// Signup handles user registration.
func (h *Handler) Signup(c *gin.Context) {
	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.userService.Signup(userService.SignupRequest{
		Email:    req.Email,
		Name:     req.Name,
		Password: req.Password,
	})
	if err != nil {
		switch err {
		case userService.ErrEmailExists:
			c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
		case userService.ErrInvalidPassword:
			c.JSON(http.StatusBadRequest, gin.H{"error": "password must be at least 8 characters"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "signup successful",
		"user":    resp,
	})
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Login handles user authentication.
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.userService.Login(&userService.LoginRequest{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		switch err {
		case userService.ErrInvalidCredentials:
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "login failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "login successful",
		"token":      resp.Token,
		"expires_at": resp.ExpiresAt,
		"user":       resp.User,
	})
}

// Me returns the current authenticated user's data.
func (h *Handler) Me(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Fetch fresh user data from database
	user, err := h.userService.GetByID(userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":                user.ID,
			"email":             user.Email,
			"name":              user.Name,
			"is_email_verified": user.IsEmailVerified,
			"created_at":        user.CreatedAt,
		},
	})
}

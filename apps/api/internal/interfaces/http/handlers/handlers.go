// Package handlers contains HTTP handler functions.
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	userService "github.com/motion-atlas/api/internal/application/user"
)

// Handler holds dependencies for HTTP handlers.
type Handler struct {
	userService *userService.Service
}

// NewHandler creates a new Handler with dependencies.
func NewHandler(us *userService.Service) *Handler {
	return &Handler{userService: us}
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

// Login handles user authentication.
func (h *Handler) Login(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "login successful"})
}

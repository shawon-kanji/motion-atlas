// Package http wires up HTTP routes.
package http

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	userService "github.com/motion-atlas/api/internal/application/user"
	"github.com/motion-atlas/api/internal/infrastructure/persistence/postgres"
	"github.com/motion-atlas/api/internal/interfaces/http/handlers"
)

// RegisterRoutes sets up all API routes.
func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	// Initialize repositories
	userRepo := postgres.NewUserRepository(db)

	// Initialize services
	userSvc := userService.NewService(userRepo)

	// Initialize handlers
	h := handlers.NewHandler(userSvc)

	r.GET("/health", handlers.Health)

	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/signup", h.Signup)
		auth.POST("/login", h.Login)
	}
}

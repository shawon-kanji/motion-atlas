// Package http wires up HTTP routes.
package http

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	assetService "github.com/motion-atlas/api/internal/application/asset"
	userService "github.com/motion-atlas/api/internal/application/user"
	"github.com/motion-atlas/api/internal/infrastructure/persistence/postgres"
	"github.com/motion-atlas/api/internal/interfaces/http/handlers"
	"github.com/motion-atlas/api/internal/interfaces/http/middleware"
)

// RegisterRoutes sets up all API routes.
func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	// Initialize repositories
	userRepo := postgres.NewUserRepository(db)
	assetRepo := postgres.NewAssetRepository(db)

	// Initialize services
	userSvc := userService.NewService(userRepo)
	assetSvc := assetService.NewService(assetRepo)

	// Initialize handlers
	h := handlers.NewHandler(userSvc, assetSvc)

	r.GET("/health", handlers.Health)

	// Public auth routes
	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/signup", h.Signup)
		auth.POST("/login", h.Login)
	}

	// Serve uploaded files statically
	r.Static("/uploads", "./uploads")

	// Protected routes (require authentication)
	protected := r.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/me", h.Me)

		// Assets
		protected.POST("/assets", h.CreateAsset)
		protected.GET("/assets", h.GetAssets)
		protected.GET("/assets/stats", h.GetAssetStats)
		protected.GET("/assets/:id", h.GetAsset)

		// Folders
		protected.POST("/folders", h.CreateFolder)
		protected.GET("/folders", h.GetFolders)
	}
}

// Package http wires up HTTP routes.
package http

import (
"github.com/gin-gonic/gin"
"github.com/motion-atlas/api/internal/interfaces/http/handlers"
)

// RegisterRoutes sets up all API routes.
func RegisterRoutes(r *gin.Engine) {
	r.GET("/health", handlers.Health)

	auth := r.Group("/api/v1/auth")
	{
		auth.POST("/signup", handlers.Signup)
		auth.POST("/login", handlers.Login)
	}
}

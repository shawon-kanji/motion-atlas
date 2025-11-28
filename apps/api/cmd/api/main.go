// Motion Atlas API - Main entrypoint
package main

import (
"log"
"os"

"github.com/gin-gonic/gin"
"github.com/joho/godotenv"

"github.com/motion-atlas/api/internal/interfaces/http"
)

func main() {
	// Load .env (ignore error if not present)
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()
	http.RegisterRoutes(r)

	log.Printf("Starting API server on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

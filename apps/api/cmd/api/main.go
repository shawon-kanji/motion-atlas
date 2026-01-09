// Motion Atlas API - Main entrypoint
package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/motion-atlas/api/internal/infrastructure/persistence/postgres"
	"github.com/motion-atlas/api/internal/interfaces/http"
)

func main() {
	// Load .env (ignore error if not present)
	_ = godotenv.Load()

	// Connect to database
	dbConfig := postgres.ConfigFromEnv()
	db, err := postgres.Connect(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migrations
	if err := postgres.AutoMigrate(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()
	http.RegisterRoutes(r, db)

	log.Printf("Starting API server on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

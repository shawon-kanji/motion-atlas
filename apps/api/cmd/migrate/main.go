package migrate
package main

import (
	"log"























}    log.Println("Migrations completed successfully.")    	}		log.Fatalf("Failed to run migrations: %v", err)	if err := postgres.AutoMigrate(db); err != nil {	// Run migrations	}		log.Fatalf("Failed to connect to database: %v", err)	if err != nil {	db, err := postgres.Connect(dbConfig)	dbConfig := postgres.ConfigFromEnv()	// Connect to database	_ = godotenv.Load()	// Load .envfunc main() {)	"github.com/motion-atlas/api/internal/infrastructure/persistence/postgres"	"github.com/joho/godotenv"
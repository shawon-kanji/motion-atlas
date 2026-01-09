.PHONY: run build test tidy db-up db-down db-logs

# Default: run the API server
run:
	go run ./cmd/api

# Build a binary
build:
	go build -o bin/api ./cmd/api

# Run tests
test:
	go test ./...

# Tidy dependencies
tidy:
	go mod tidy

# Start PostgreSQL container
db-up:
	docker compose up -d

# Stop PostgreSQL container
db-down:
	docker compose down

# View PostgreSQL logs
db-logs:
	docker compose logs -f postgres

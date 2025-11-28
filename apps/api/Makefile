.PHONY: run build test tidy

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

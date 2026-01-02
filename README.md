# Motion Atlas

Video & Digital Asset Management SaaS — monorepo with Go backend and React frontend.

## Structure

```
motion-atlas/
├── apps/
│   ├── api/          # Go + Gin backend (DDD)
│   └── web/          # React + Vite frontend
├── packages/         # Shared packages (future)
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js 22.11.0 (see .nvmrc)
- pnpm ≥ 9
- Go ≥ 1.23

## Quick Start

### Install dependencies

```bash
pnpm install
```

### Run frontend (dev)

```bash
pnpm dev
# Opens http://localhost:3000
```

### Run backend (dev)

```bash
cd apps/api
cp .env.example .env   # configure as needed
go run ./cmd/api
# Runs on http://localhost:8080
```

### Build

```bash
# Frontend
pnpm build

# Backend
cd apps/api && make build
```

## API Endpoints

| Method | Path              | Description     |
|--------|-------------------|-----------------|
| GET    | /health           | Health check    |
| POST   | /api/v1/auth/signup | User signup   |
| POST   | /api/v1/auth/login  | User login    |

## License

MIT

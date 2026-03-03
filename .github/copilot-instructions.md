# Motion Atlas — Copilot Instructions

## Project Overview

Video/Digital Asset Management SaaS. Monorepo with a **Go API** (`apps/api/`) and **React SPA** (`apps/web/`), managed by pnpm workspaces.

## Architecture

### Backend (`apps/api/`) — Go + Gin + GORM, DDD layers

```
internal/
  domain/           # Pure domain models + Repository interfaces (no imports from other layers)
  application/      # Service structs that orchestrate use-cases via repository interfaces
  infrastructure/   # Concrete implementations: postgres (GORM), storage (S3), queue
  interfaces/http/  # Gin router, handlers, middleware — depends on application services
```

- **Domain models** (`domain/{user,asset,workspace}/`) define structs and `Repository` interfaces. Never import infrastructure.
- **Application services** accept a `Repository` interface and expose use-case methods (`Get`, `List`, `Create`).
- **Persistence** uses GORM models (`infrastructure/persistence/postgres/models.go`) with `ToDomain()` / `FromDomain()` converters — keep domain and GORM models separate.
- **Router** (`interfaces/http/router.go`) wires repos → services → handlers. All protected routes are under `/api/v1/` with JWT `AuthMiddleware`.
- **Handler struct** (`interfaces/http/handlers/handlers.go`) holds all three service dependencies; individual handler files (`asset_handler.go`, `workspace_handler.go`) add methods to it.

### Frontend (`apps/web/`) — React 18 + Vite + TypeScript

- **State**: Zustand stores (`stores/authStore.ts`, `stores/assetStore.ts`) for client state; TanStack React Query for server-state (see `api/assets.ts` hooks like `useAssets`, `useCreateAsset`).
- **API client**: Axios instance at `api/client.ts` with base URL `/api/v1` — Vite dev server proxies `/api` → `localhost:8080`.
- **Auth flow**: JWT stored in `localStorage`; Axios interceptor attaches `Bearer` token; 401 clears token.
- **Path alias**: `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
- **Styling**: Tailwind CSS v4 with `clsx` utility. Icons from `lucide-react`.
- **UI components** live in `components/ui/` (Button, Modal, Card, etc.) and are reused across pages.

## Dev Commands

```bash
# Dependencies & prerequisites: Node ≥22, pnpm ≥9, Go ≥1.23
pnpm install

# Start PostgreSQL (required before API)
cd apps/api && make db-up         # docker compose up -d

# Run API (port 8080) — loads .env automatically
pnpm dev:api                      # or: cd apps/api && go run ./cmd/api

# Run frontend (port 3000, proxies /api → :8080)
pnpm dev

# Run both concurrently
pnpm dev:all

# Tests
cd apps/api && make test          # go test ./...
cd apps/web && pnpm test          # vitest run

# Build
pnpm build                        # frontend (vite build)
cd apps/api && make build          # go binary → bin/api
```

## Conventions & Patterns

### Go backend
- **IDs**: UUID strings generated with `github.com/google/uuid`.
- **Error handling**: Sentinel errors in application services (e.g., `ErrEmailExists`, `ErrInvalidCredentials`); handlers map them to HTTP status codes via `switch`.
- **Request validation**: Gin's `binding` tags on handler request structs (`binding:"required,email"`).
- **Table-driven tests**: See `domain/workspace/workspace_test.go` for the pattern — define `tests []struct`, iterate with `t.Run`.
- **Config**: Environment variables with sensible defaults via `getEnv(key, fallback)` in `postgres/db.go`. Auto-migration on startup via `postgres.AutoMigrate(db)`.

### React frontend
- **New API endpoints**: Add typed functions in `api/` directory, then create React Query hooks (`useQuery`/`useMutation`) in the same file. Invalidate related query keys on mutations.
- **New pages**: Add component in `pages/`, wire route in `App.tsx` with auth guard pattern: `element={isAuthenticated ? <Page /> : <Navigate to="/login" />}`.
- **Zustand stores**: Single `create<State>()` call exporting a `useXxxStore` hook. Keep server-fetched data in React Query; use stores for UI/client state.

### Cross-stack
- **API contract**: JSON with `camelCase` keys in domain models (Go struct tags). Query params use `snake_case` (`workspace_id`, `folder_id`).
- **File uploads**: `multipart/form-data` POST to `/api/v1/assets`; backend saves to `uploads/` directory (local dev) or S3 (production — `infrastructure/storage/s3.go` is a placeholder).
- **Workspace scoping**: Most data is scoped to a workspace. The frontend sends `workspace_id` from `authStore.workspace`; the backend filters by it.

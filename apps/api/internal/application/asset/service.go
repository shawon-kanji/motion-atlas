// Package asset contains application services for assets.
package asset

import (
"github.com/motion-atlas/api/internal/domain/asset"
)

// Service orchestrates asset use-cases.
type Service struct {
	repo asset.Repository
}

// NewService creates a new asset service.
func NewService(repo asset.Repository) *Service {
	return &Service{repo: repo}
}

// Get retrieves an asset by ID.
func (s *Service) Get(id string) (*asset.Asset, error) {
	return s.repo.FindByID(id)
}

// List retrieves assets in a workspace.
func (s *Service) List(workspaceID string, limit, offset int) ([]*asset.Asset, error) {
	return s.repo.FindByWorkspace(workspaceID, limit, offset)
}

// Create persists a new asset.
func (s *Service) Create(a *asset.Asset) error {
	return s.repo.Save(a)
}

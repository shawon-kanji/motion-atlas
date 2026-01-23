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
func (s *Service) List(workspaceID string, folderID *string, limit, offset int) ([]*asset.Asset, error) {
	return s.repo.FindByWorkspace(workspaceID, folderID, limit, offset)
}

// Create persists a new asset.
func (s *Service) Create(a *asset.Asset) error {
	return s.repo.Save(a)
}

// GetStats returns usage statistics for a workspace.
func (s *Service) GetStats(workspaceID string) (*asset.Stats, error) {
	return s.repo.GetStats(workspaceID)
}

// CreateFolder creates a new folder
func (s *Service) CreateFolder(f *asset.Folder) error {
	return s.repo.CreateFolder(f)
}

// ListFolders returns folders for a parent directory
func (s *Service) ListFolders(workspaceID string, parentID *string) ([]*asset.Folder, error) {
	return s.repo.GetFolders(workspaceID, parentID)
}

// GetFolder retrieves a specific folder
func (s *Service) GetFolder(id string) (*asset.Folder, error) {
	return s.repo.GetFolder(id)
}

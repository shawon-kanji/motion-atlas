// Package workspace contains application services for workspaces.
package workspace

import (
	"github.com/motion-atlas/api/internal/domain/workspace"
)

// Service orchestrates workspace use-cases.
type Service struct {
	repo workspace.Repository
}

// NewService creates a new workspace service.
func NewService(repo workspace.Repository) *Service {
	return &Service{repo: repo}
}

// Get retrieves a workspace by ID.
func (s *Service) Get(id string) (*workspace.Workspace, error) {
	return s.repo.FindByID(id)
}

// Create persists a new workspace.
func (s *Service) Create(ws *workspace.Workspace) error {
	return s.repo.Save(ws)
}

// AddMember adds a member to a workspace.
func (s *Service) AddMember(m *workspace.Member) error {
	return s.repo.AddMember(m)
}

// ListByUser retrieves workspaces a user is a member of.
func (s *Service) ListByUser(userID string) ([]*workspace.Workspace, error) {
	return s.repo.FindByUserID(userID)
}

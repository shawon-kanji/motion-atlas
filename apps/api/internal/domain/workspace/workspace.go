// Package workspace contains the Workspace domain model.
package workspace

import "time"

// Workspace represents an isolated team/project context.
type Workspace struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	OwnerID   string    `json:"ownerId"`
	Plan      string    `json:"plan"` // free, creator, team, business, enterprise
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Member represents a user's membership in a workspace.
type Member struct {
	UserID      string    `json:"userId"`
	WorkspaceID string    `json:"workspaceId"`
	Role        string    `json:"role"` // owner, editor, viewer
	JoinedAt    time.Time `json:"joinedAt"`
}

// Repository defines persistence operations for workspaces.
type Repository interface {
	FindByID(id string) (*Workspace, error)
	FindByOwner(ownerID string) ([]*Workspace, error)
	Save(ws *Workspace) error
	Delete(id string) error
	AddMember(member *Member) error
	RemoveMember(workspaceID, userID string) error
	GetMembers(workspaceID string) ([]*Member, error)
	FindByUserID(userID string) ([]*Workspace, error)
}

// Package workspace contains the Workspace domain model.
package workspace

import "time"

// Workspace represents an isolated team/project context.
type Workspace struct {
	ID        string
	Name      string
	OwnerID   string
	Plan      string // free, creator, team, business, enterprise
	CreatedAt time.Time
	UpdatedAt time.Time
}

// Member represents a user's membership in a workspace.
type Member struct {
UserID      string
WorkspaceID string
Role        string // owner, editor, viewer
JoinedAt    time.Time
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
}

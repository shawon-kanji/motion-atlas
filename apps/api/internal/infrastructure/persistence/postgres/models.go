// Package postgres contains GORM models for PostgreSQL.
package postgres

import (
	"time"

	"github.com/motion-atlas/api/internal/domain/asset"
	"github.com/motion-atlas/api/internal/domain/user"
	"github.com/motion-atlas/api/internal/domain/workspace"
)

// UserModel is the GORM model for the users table.
type UserModel struct {
	ID              string `gorm:"type:uuid;primaryKey"`
	Email           string `gorm:"type:varchar(255);uniqueIndex;not null"`
	Name            string `gorm:"type:varchar(255);not null"`
	PasswordHash    string `gorm:"type:varchar(255)"`
	IsEmailVerified bool   `gorm:"default:false"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
	workspaces      []WorkspaceModel `gorm:"foreignKey:OwnerID"`
}

// TableName specifies the table name for UserModel.
func (UserModel) TableName() string {
	return "users"
}

// ToDomain converts UserModel to domain User.
func (m *UserModel) ToDomain() *user.User {
	return &user.User{
		ID:              m.ID,
		Email:           m.Email,
		Name:            m.Name,
		PasswordHash:    m.PasswordHash,
		IsEmailVerified: m.IsEmailVerified,
		CreatedAt:       m.CreatedAt,
		UpdatedAt:       m.UpdatedAt,
	}
}

// UserModelFromDomain converts domain User to UserModel.
func UserModelFromDomain(u *user.User) *UserModel {
	return &UserModel{
		ID:              u.ID,
		Email:           u.Email,
		Name:            u.Name,
		PasswordHash:    u.PasswordHash,
		IsEmailVerified: u.IsEmailVerified,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}
}

// WorkspaceModel is the GORM model for the workspaces table.
type WorkspaceModel struct {
	ID        string `gorm:"type:uuid;primaryKey"`
	Name      string `gorm:"type:varchar(255);not null"`
	OwnerID   string `gorm:"type:uuid;not null"`
	Plan      string `gorm:"type:varchar(50);default:'free'"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Members   []MemberModel `gorm:"foreignKey:WorkspaceID"`
}

// MemberModel is the GORM model for the workspace_members table.
type MemberModel struct {
	UserID      string `gorm:"type:uuid;primaryKey"`
	WorkspaceID string `gorm:"type:uuid;primaryKey"`
	Role        string `gorm:"type:varchar(50);default:'viewer'"`
	JoinedAt    time.Time
}

// TableName specifies the table name for WorkspaceModel.
func (WorkspaceModel) TableName() string {
	return "workspaces"
}

// TableName specifies the table name for MemberModel.
func (MemberModel) TableName() string {
	return "workspace_members"
}

// ToDomain converts WorkspaceModel to domain Workspace.
func (m *WorkspaceModel) ToDomain() *workspace.Workspace {
	return &workspace.Workspace{
		ID:        m.ID,
		Name:      m.Name,
		OwnerID:   m.OwnerID,
		Plan:      m.Plan,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

// WorkspaceModelFromDomain converts domain Workspace to WorkspaceModel.
func WorkspaceModelFromDomain(w *workspace.Workspace) *WorkspaceModel {
	return &WorkspaceModel{
		ID:        w.ID,
		Name:      w.Name,
		OwnerID:   w.OwnerID,
		Plan:      w.Plan,
		CreatedAt: w.CreatedAt,
		UpdatedAt: w.UpdatedAt,
	}
}

// ToDomain converts MemberModel to domain Member.
func (m *MemberModel) ToDomain() *workspace.Member {
	return &workspace.Member{
		UserID:      m.UserID,
		WorkspaceID: m.WorkspaceID,
		Role:        m.Role,
		JoinedAt:    m.JoinedAt,
	}
}

// MemberModelFromDomain converts domain Member to MemberModel.
func MemberModelFromDomain(m *workspace.Member) *MemberModel {
	return &MemberModel{
		UserID:      m.UserID,
		WorkspaceID: m.WorkspaceID,
		Role:        m.Role,
		JoinedAt:    m.JoinedAt,
	}
}

// AssetModel is the GORM model for the assets table.
type AssetModel struct {
	ID          string   `gorm:"type:uuid;primaryKey"`
	WorkspaceID string   `gorm:"type:uuid;index;not null"`
	FolderID    *string  `gorm:"type:uuid;index"`
	Name        string   `gorm:"type:varchar(255);not null"`
	Type        string   `gorm:"type:varchar(50);not null"`
	URL         string   `gorm:"type:text"`
	Size        int64    `gorm:"not null"`
	Duration    float64  `gorm:"default:0"`
	Status      string   `gorm:"type:varchar(50);default:'processing'"`
	Tags        []string `gorm:"serializer:json"` // Store as JSON for simplicity
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// TableName specifies the table name for AssetModel.
func (AssetModel) TableName() string {
	return "assets"
}

// ToDomain converts AssetModel to domain Asset.
func (m *AssetModel) ToDomain() *asset.Asset {
	return &asset.Asset{
		ID:          m.ID,
		WorkspaceID: m.WorkspaceID,
		FolderID:    m.FolderID,
		Name:        m.Name,
		Type:        m.Type,
		URL:         m.URL,
		Size:        m.Size,
		Duration:    m.Duration,
		Status:      m.Status,
		Tags:        m.Tags,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}
}

// AssetModelFromDomain converts domain Asset to AssetModel.
func AssetModelFromDomain(a *asset.Asset) *AssetModel {
	return &AssetModel{
		ID:          a.ID,
		WorkspaceID: a.WorkspaceID,
		FolderID:    a.FolderID,
		Name:        a.Name,
		Type:        a.Type,
		URL:         a.URL,
		Size:        a.Size,
		Duration:    a.Duration,
		Status:      a.Status,
		Tags:        a.Tags,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
	}
}

// FolderModel is the GORM model for the folders table.
type FolderModel struct {
	ID          string  `gorm:"type:uuid;primaryKey"`
	WorkspaceID string  `gorm:"type:uuid;index;not null"`
	ParentID    *string `gorm:"type:uuid;index"`
	Name        string  `gorm:"type:varchar(255);not null"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// TableName specifies the table name for FolderModel.
func (FolderModel) TableName() string {
	return "folders"
}

// ToDomain converts FolderModel to domain Folder.
func (m *FolderModel) ToDomain() *asset.Folder {
	return &asset.Folder{
		ID:          m.ID,
		WorkspaceID: m.WorkspaceID,
		ParentID:    m.ParentID,
		Name:        m.Name,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}
}

// FolderModelFromDomain converts domain Folder to FolderModel.
func FolderModelFromDomain(f *asset.Folder) *FolderModel {
	return &FolderModel{
		ID:          f.ID,
		WorkspaceID: f.WorkspaceID,
		ParentID:    f.ParentID,
		Name:        f.Name,
		CreatedAt:   f.CreatedAt,
		UpdatedAt:   f.UpdatedAt,
	}
}

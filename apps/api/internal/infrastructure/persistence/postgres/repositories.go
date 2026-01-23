// Package postgres contains PostgreSQL repository implementations.
package postgres

import (
	"errors"
	"time"

	"gorm.io/gorm"

	"github.com/motion-atlas/api/internal/domain/asset"
	"github.com/motion-atlas/api/internal/domain/user"
	"github.com/motion-atlas/api/internal/domain/workspace"
)

// Common errors
var (
	ErrNotFound      = errors.New("record not found")
	ErrAlreadyExists = errors.New("record already exists")
)

// UserRepository implements user.Repository with GORM/PostgreSQL.
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new UserRepository.
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// FindByID retrieves a user by ID.
func (r *UserRepository) FindByID(id string) (*user.User, error) {
	var model UserModel
	if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return model.ToDomain(), nil
}

// FindByEmail retrieves a user by email.
func (r *UserRepository) FindByEmail(email string) (*user.User, error) {
	var model UserModel
	if err := r.db.Where("email = ?", email).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return model.ToDomain(), nil
}

// AssetRepository implements asset.Repository with GORM/PostgreSQL.
type AssetRepository struct {
	db *gorm.DB
}

// NewAssetRepository creates a new AssetRepository.
func NewAssetRepository(db *gorm.DB) *AssetRepository {
	return &AssetRepository{db: db}
}

// FindByID retrieves an asset by ID.
func (r *AssetRepository) FindByID(id string) (*asset.Asset, error) {
	var model AssetModel
	if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return model.ToDomain(), nil
}

// FindByWorkspace retrieves assets by workspace ID with pagination.
// If folderID is provided, it filters by folder.
// If folderID is nil (but checked explicitly in call), it could mean "root".
// We need to handle this convention carefully.
// A simpler way:
// If folderID != nil, filter by folder_id = *folderID.
// If folderID == nil, filter by folder_id IS NULL (root assets).
func (r *AssetRepository) FindByWorkspace(workspaceID string, folderID *string, limit, offset int) ([]*asset.Asset, error) {
	query := r.db.Where("workspace_id = ?", workspaceID)

	if folderID != nil {
		query = query.Where("folder_id = ?", *folderID)
	} else {
		// If explicit nil passed, we want root assets
		query = query.Where("folder_id IS NULL")
	}

	var models []AssetModel
	if err := query.
		Limit(limit).
		Offset(offset).
		Order("created_at desc").
		Find(&models).Error; err != nil {
		return nil, err
	}

	assets := make([]*asset.Asset, len(models))
	for i, m := range models {
		assets[i] = m.ToDomain()
	}
	return assets, nil
}

// Save persists an asset.
func (r *AssetRepository) Save(a *asset.Asset) error {
	model := AssetModelFromDomain(a)
	return r.db.Save(model).Error
}

// Delete removes an asset by ID.
func (r *AssetRepository) Delete(id string) error {
	return r.db.Delete(&AssetModel{}, "id = ?", id).Error
}

// GetStats returns usage statistics for a workspace.
func (r *AssetRepository) GetStats(workspaceID string) (*asset.Stats, error) {
	var stats asset.Stats

	// Total assets
	if err := r.db.Model(&AssetModel{}).
		Where("workspace_id = ?", workspaceID).
		Count(&stats.TotalAssets).Error; err != nil {
		return nil, err
	}

	// Recent uploads (last 7 days)
	weekAgo := time.Now().AddDate(0, 0, -7)
	if err := r.db.Model(&AssetModel{}).
		Where("workspace_id = ? AND created_at >= ?", workspaceID, weekAgo).
		Count(&stats.RecentUploadsLastWeek).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

// CreateFolder persists a new folder.
func (r *AssetRepository) CreateFolder(folder *asset.Folder) error {
	model := FolderModelFromDomain(folder)
	return r.db.Save(model).Error
}

// GetFolders retrieves folders in a specific directory (root or subdirectory).
func (r *AssetRepository) GetFolders(workspaceID string, parentID *string) ([]*asset.Folder, error) {
	query := r.db.Where("workspace_id = ?", workspaceID)

	if parentID != nil {
		query = query.Where("parent_id = ?", *parentID)
	} else {
		query = query.Where("parent_id IS NULL")
	}

	var models []FolderModel
	if err := query.Order("name asc").Find(&models).Error; err != nil {
		return nil, err
	}

	folders := make([]*asset.Folder, len(models))
	for i, m := range models {
		f := m.ToDomain()

		// Get asset count
		var count int64
		r.db.Model(&AssetModel{}).Where("folder_id = ?", f.ID).Count(&count)
		f.AssetCount = count

		folders[i] = f
	}

	return folders, nil
}

// GetFolder retrieves a folder by ID.
func (r *AssetRepository) GetFolder(id string) (*asset.Folder, error) {
	var model FolderModel
	if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return model.ToDomain(), nil
}

// DeleteFolder removes a folder.
func (r *AssetRepository) DeleteFolder(id string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Optional: Delete children or move them to root?
		// For now, let's assume cascade delete or forbid if not empty is logic for service layer.
		// DB FK constraints might handle cascade.
		return tx.Delete(&FolderModel{}, "id = ?", id).Error
	})
}

// Save creates or updates a user.
func (r *UserRepository) Save(u *user.User) error {
	model := UserModelFromDomain(u)

	// Check if user exists
	var existing UserModel
	err := r.db.Where("id = ?", u.ID).First(&existing).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Create new user
		if err := r.db.Create(model).Error; err != nil {
			// Check for unique constraint violation
			if isUniqueViolation(err) {
				return ErrAlreadyExists
			}
			return err
		}
		return nil
	}

	if err != nil {
		return err
	}

	// Update existing user
	return r.db.Save(model).Error
}

// Delete removes a user by ID.
func (r *UserRepository) Delete(id string) error {
	result := r.db.Where("id = ?", id).Delete(&UserModel{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}

// isUniqueViolation checks if the error is a unique constraint violation.
func isUniqueViolation(err error) bool {
	if err == nil {
		return false
	}
	errStr := err.Error()
	// PostgreSQL unique violation error code is 23505
	return errors.Is(err, gorm.ErrDuplicatedKey) ||
		contains(errStr, "23505") ||
		contains(errStr, "duplicate key")
}

func contains(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// WorkspaceRepository implements workspace.Repository with GORM/PostgreSQL.
type WorkspaceRepository struct {
	db *gorm.DB
}

// NewWorkspaceRepository creates a new WorkspaceRepository.
func NewWorkspaceRepository(db *gorm.DB) *WorkspaceRepository {
	return &WorkspaceRepository{db: db}
}

// FindByID retrieves a workspace by ID.
func (r *WorkspaceRepository) FindByID(id string) (*workspace.Workspace, error) {
	var model WorkspaceModel
	if err := r.db.Where("id = ?", id).First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return model.ToDomain(), nil
}

// FindByOwner retrieves workspaces owned by a user.
func (r *WorkspaceRepository) FindByOwner(ownerID string) ([]*workspace.Workspace, error) {
	var models []WorkspaceModel
	if err := r.db.Where("owner_id = ?", ownerID).Find(&models).Error; err != nil {
		return nil, err
	}

	workspaces := make([]*workspace.Workspace, len(models))
	for i, m := range models {
		workspaces[i] = m.ToDomain()
	}
	return workspaces, nil
}

// Save persists a workspace.
func (r *WorkspaceRepository) Save(ws *workspace.Workspace) error {
	model := WorkspaceModelFromDomain(ws)
	return r.db.Save(model).Error
}

// Delete removes a workspace.
func (r *WorkspaceRepository) Delete(id string) error {
	return r.db.Delete(&WorkspaceModel{}, "id = ?", id).Error
}

// AddMember adds a user to a workspace.
func (r *WorkspaceRepository) AddMember(member *workspace.Member) error {
	model := MemberModelFromDomain(member)
	return r.db.Create(model).Error
}

// RemoveMember removes a user from a workspace.
func (r *WorkspaceRepository) RemoveMember(workspaceID, userID string) error {
	return r.db.Where("workspace_id = ? AND user_id = ?", workspaceID, userID).Delete(&MemberModel{}).Error
}

// GetMembers retrieves members of a workspace.
func (r *WorkspaceRepository) GetMembers(workspaceID string) ([]*workspace.Member, error) {
	var models []MemberModel
	if err := r.db.Where("workspace_id = ?", workspaceID).Find(&models).Error; err != nil {
		return nil, err
	}

	members := make([]*workspace.Member, len(models))
	for i, m := range models {
		members[i] = m.ToDomain()
	}
	return members, nil
}

// FindByUserID finds all workspaces a user is a member of.
func (r *WorkspaceRepository) FindByUserID(userID string) ([]*workspace.Workspace, error) {
	var models []WorkspaceModel
	err := r.db.Joins("JOIN workspace_members on workspace_members.workspace_id = workspaces.id").
		Where("workspace_members.user_id = ?", userID).
		Find(&models).Error

	if err != nil {
		return nil, err
	}

	workspaces := make([]*workspace.Workspace, len(models))
	for i, m := range models {
		workspaces[i] = m.ToDomain()
	}
	return workspaces, nil
}

// Package asset contains the Asset domain model.
package asset

import "time"

// Asset represents a media asset in the system.
type Asset struct {
	ID          string    `json:"id"`
	WorkspaceID string    `json:"workspaceId"`
	FolderID    *string   `json:"folderId"` // Nullable for root level assets
	Name        string    `json:"name"`
	Type        string    `json:"type"` // video, image, audio, document
	URL         string    `json:"url"`  // Local path or S3 URL
	Size        int64     `json:"size"`
	Duration    float64   `json:"duration"` // seconds, for video/audio
	Status      string    `json:"status"`   // uploading, processing, ready, error
	Tags        []string  `json:"tags"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Folder represents a logical container for assets.
type Folder struct {
	ID          string    `json:"id"`
	WorkspaceID string    `json:"workspaceId"`
	ParentID    *string   `json:"parentId"` // Nullable for root level folders
	Name        string    `json:"name"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	// Helper field, might not be persisted directly on Folder
	AssetCount int64 `json:"assetCount"`
}

// Stats represents asset statistics.
type Stats struct {
	TotalAssets           int64 `json:"totalAssets"`
	RecentUploadsLastWeek int64 `json:"recentUploadsLastWeek"`
}

// Repository defines persistence operations for assets.
type Repository interface {
	FindByID(id string) (*Asset, error)
	// FindByWorkspace retrieves assets. folderID can be nil (root) or specific ID.
	FindByWorkspace(workspaceID string, folderID *string, limit, offset int) ([]*Asset, error)
	Save(asset *Asset) error
	Delete(id string) error
	GetStats(workspaceID string) (*Stats, error)

	// Folder operations
	CreateFolder(folder *Folder) error
	GetFolders(workspaceID string, parentID *string) ([]*Folder, error)
	GetFolder(id string) (*Folder, error)
	DeleteFolder(id string) error
}

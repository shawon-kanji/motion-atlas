// Package asset contains the Asset domain model.
package asset

import "time"

// Asset represents a media asset in the system.
type Asset struct {
	ID          string
	WorkspaceID string
	Name        string
	Type        string // video, image, audio, document
	Size        int64
	Duration    float64 // seconds, for video/audio
	Status      string  // uploading, processing, ready, error
	Tags        []string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// Repository defines persistence operations for assets.
type Repository interface {
	FindByID(id string) (*Asset, error)
	FindByWorkspace(workspaceID string, limit, offset int) ([]*Asset, error)
	Save(asset *Asset) error
	Delete(id string) error
}

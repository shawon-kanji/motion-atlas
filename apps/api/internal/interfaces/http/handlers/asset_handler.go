package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/motion-atlas/api/internal/domain/asset"
)

// CreateAsset handles asset creation with file upload.
func (h *Handler) CreateAsset(c *gin.Context) {
	// Parse Multipart Form
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil { // 32MB max memory
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to parse multipart form"})
		return
	}

	// Get file from form
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	// Get metadata from form
	workspaceID := c.PostForm("workspace_id")
	if workspaceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "workspace_id is required"})
		return
	}

	name := c.PostForm("name")
	if name == "" {
		name = file.Filename
	}

	assetType := c.PostForm("type")
	if assetType == "" {
		// Simple type detection extension
		ext := strings.ToLower(filepath.Ext(file.Filename))
		switch ext {
		case ".jpg", ".jpeg", ".png", ".gif", ".webp":
			assetType = "image"
		case ".mp4", ".mov", ".avi", ".webm":
			assetType = "video"
		case ".mp3", ".wav":
			assetType = "audio"
		default:
			assetType = "document"
		}
	}

	var folderID *string
	if fid := c.PostForm("folder_id"); fid != "" && fid != "null" && fid != "root" {
		folderID = &fid
	}

	// Simple tags parsing (comma separated)
	var tags []string
	if t := c.PostForm("tags"); t != "" {
		tags = strings.Split(t, ",")
	}

	// Save file locally
	uploadDir := "./uploads"
	// Ensure directory exists
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Generate unique filename to avoid collisions
	ext := filepath.Ext(file.Filename)
	uniqueFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	dst := filepath.Join(uploadDir, uniqueFilename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	// Create Asset Record
	// For local served files, URL will be relative like /uploads/filename.ext
	fileURL := "/uploads/" + uniqueFilename

	now := time.Now()
	newAsset := &asset.Asset{
		ID:          uuid.New().String(),
		WorkspaceID: workspaceID,
		FolderID:    folderID,
		Name:        name,
		Type:        assetType,
		Size:        file.Size,
		URL:         fileURL,
		Status:      "ready",
		Tags:        tags,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if err := h.assetService.Create(newAsset); err != nil {
		// Clean up file if DB save fails
		os.Remove(dst)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create asset record"})
		return
	}

	c.JSON(http.StatusCreated, newAsset)
}

// GetAssets retrieves a list of assets for a workspace.
func (h *Handler) GetAssets(c *gin.Context) {
	workspaceID := c.Query("workspace_id")
	if workspaceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "workspace_id is required"})
		return
	}

	// Handle folder filtering
	var folderID *string
	if fid := c.Query("folder_id"); fid != "" {
		if fid == "root" || fid == "null" {
			// explicit root
			folderID = nil
		} else {
			folderID = &fid
		}
	} else {
		// If param is missing effectively means root view in many UIs,
		// but let's assume if it's missing (and we use a "view" logic),
		// we might want all assets or root assets.
		// Given the UI sends folderId=null for root, let's treat missing as null (root).
		folderID = nil
	}

	limit := 20
	offset := 0

	if l, err := strconv.Atoi(c.Query("limit")); err == nil && l > 0 {
		limit = l
	}
	if o, err := strconv.Atoi(c.Query("offset")); err == nil && o >= 0 {
		offset = o
	}

	assets, err := h.assetService.List(workspaceID, folderID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch assets"})
		return
	}

	c.JSON(http.StatusOK, assets)
}

// CreateFolderRequest represents request to create a folder
type CreateFolderRequest struct {
	Name        string  `json:"name" binding:"required"`
	WorkspaceID string  `json:"workspace_id" binding:"required"`
	ParentID    *string `json:"parent_id"`
}

// CreateFolder handles folder creation
func (h *Handler) CreateFolder(c *gin.Context) {
	var req CreateFolderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()
	folder := &asset.Folder{
		ID:          uuid.New().String(),
		WorkspaceID: req.WorkspaceID,
		ParentID:    req.ParentID,
		Name:        req.Name,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if err := h.assetService.CreateFolder(folder); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create folder"})
		return
	}

	c.JSON(http.StatusCreated, folder)
}

// GetFolders retrieves folders (subdirectories)
func (h *Handler) GetFolders(c *gin.Context) {
	workspaceID := c.Query("workspace_id")
	if workspaceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "workspace_id is required"})
		return
	}

	var parentID *string
	if pid := c.Query("parent_id"); pid != "" {
		parentID = &pid
	}

	folders, err := h.assetService.ListFolders(workspaceID, parentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch folders"})
		return
	}

	c.JSON(http.StatusOK, folders)
}

// GetAsset retrieves a single asset.
func (h *Handler) GetAsset(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id is required"})
		return
	}

	a, err := h.assetService.Get(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "asset not found"})
		return
	}

	c.JSON(http.StatusOK, a)
}

// GetAssetStats returns statistics for assets in a workspace.
func (h *Handler) GetAssetStats(c *gin.Context) {
	workspaceID := c.Query("workspace_id")
	if workspaceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "workspace_id is required"})
		return
	}

	stats, err := h.assetService.GetStats(workspaceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

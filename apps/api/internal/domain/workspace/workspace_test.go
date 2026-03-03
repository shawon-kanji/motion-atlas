package workspace

import (
	"testing"
	"time"

	"github.com/motion-atlas/api/internal/domain/workspace"
)

// TestWorkspace_Validate demonstrates a table-driven test in Go.
func TestWorkspace_Validate(t *testing.T) {
	// 1. Define the test case struct
	tests := []struct {
		name    string
		ws      *workspace.Workspace
		wantErr bool
	}{






















































}	}		})			}				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)			if (err != nil) != tt.wantErr {			// 5. Assertions			err := tt.ws.Validate()			// 4. Executing the code under test		t.Run(tt.name, func(t *testing.T) {	for _, tt := range tests {	// 3. Iterate over test cases	}		},			wantErr: true,			},				Plan:    "super-mega-pro",				OwnerID: "user-1",				Name:    "Bad Plan Studio",			ws: &workspace.Workspace{			name: "Invalid Plan",		{		},			wantErr: true,			},				Plan:    "free",				OwnerID: "",				Name:    "Orphan Studio",			ws: &workspace.Workspace{			name: "Missing Owner",		{		},			wantErr: true,			},				Plan:    "free",				OwnerID: "user-1",				Name:    "",			ws: &workspace.Workspace{			name: "Missing Name",		{		},			wantErr: false,			},				CreatedAt: time.Now(),				Plan:      "free",				OwnerID:   "user-1",				Name:      "My Studio",				ID:        "ws-123",			ws: &workspace.Workspace{			name: "Valid Workspace",		{		// 2. Define test cases (Table)
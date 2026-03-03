package handlers

import (
	"github.com/gin-gonic/gin"
)

// GetUserID extracts user ID from context.
func GetUserID(c *gin.Context) string {
	if id, exists := c.Get("userID"); exists {
		if s, ok := id.(string); ok {
			return s
		}
	}
	return ""
}

// Package handlers contains HTTP handler functions.
package handlers

import (
"net/http"

"github.com/gin-gonic/gin"
)

// Health returns service health status.
func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// Signup handles user registration.
func Signup(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "signup successful"})
}

// Login handles user authentication.
func Login(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "login successful"})
}

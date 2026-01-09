// Package user contains the User domain model.
package user

import "time"

// User represents an authenticated user.
type User struct {
	ID              string
	Email           string
	Name            string
	PasswordHash    string // empty if OAuth-only
	IsEmailVerified bool
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// Repository defines persistence operations for users.
type Repository interface {
	FindByID(id string) (*User, error)
	FindByEmail(email string) (*User, error)
	Save(user *User) error
	Delete(id string) error
}

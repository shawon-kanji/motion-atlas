// Package postgres contains GORM models for PostgreSQL.
package postgres

import (
	"time"

	"github.com/motion-atlas/api/internal/domain/user"
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

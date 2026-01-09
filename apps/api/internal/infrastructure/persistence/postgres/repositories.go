// Package postgres contains PostgreSQL repository implementations.
package postgres

import (
	"errors"

	"gorm.io/gorm"

	"github.com/motion-atlas/api/internal/domain/user"
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

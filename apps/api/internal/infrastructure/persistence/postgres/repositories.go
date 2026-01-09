// Package postgres contains PostgreSQL repository implementations.
package postgres

import (
	"errors"
	"sync"

	"github.com/motion-atlas/api/internal/domain/user"
)

// Common errors
var (
	ErrNotFound      = errors.New("record not found")
	ErrAlreadyExists = errors.New("record already exists")
)

// In-memory storage for testing (simulates database)
var (
	usersDB   = make(map[string]*user.User) // key: user ID
	emailsDB  = make(map[string]string)     // key: email, value: user ID
	userMutex sync.RWMutex
)

// UserRepository implements user.Repository with in-memory storage.
type UserRepository struct{}

// NewUserRepository creates a new UserRepository.
func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

// FindByID retrieves a user by ID.
func (r *UserRepository) FindByID(id string) (*user.User, error) {
	userMutex.RLock()
	defer userMutex.RUnlock()

	u, ok := usersDB[id]
	if !ok {
		return nil, ErrNotFound
	}
	return u, nil
}

// FindByEmail retrieves a user by email.
func (r *UserRepository) FindByEmail(email string) (*user.User, error) {
	userMutex.RLock()
	defer userMutex.RUnlock()

	id, ok := emailsDB[email]
	if !ok {
		return nil, ErrNotFound
	}
	return usersDB[id], nil
}

// Save creates or updates a user.
func (r *UserRepository) Save(u *user.User) error {
	userMutex.Lock()
	defer userMutex.Unlock()

	// Check if email already exists for a different user
	if existingID, ok := emailsDB[u.Email]; ok && existingID != u.ID {
		return ErrAlreadyExists
	}

	usersDB[u.ID] = u
	emailsDB[u.Email] = u.ID
	return nil
}

// Delete removes a user by ID.
func (r *UserRepository) Delete(id string) error {
	userMutex.Lock()
	defer userMutex.Unlock()

	u, ok := usersDB[id]
	if !ok {
		return ErrNotFound
	}

	delete(emailsDB, u.Email)
	delete(usersDB, id)
	return nil
}

// GetAllUsers returns all users (for debugging).
func (r *UserRepository) GetAllUsers() []*user.User {
	userMutex.RLock()
	defer userMutex.RUnlock()

	users := make([]*user.User, 0, len(usersDB))
	for _, u := range usersDB {
		users = append(users, u)
	}
	return users
}

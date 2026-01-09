// Package user contains application services for users.
package user

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/motion-atlas/api/internal/domain/user"
	"golang.org/x/crypto/bcrypt"
)

// Service errors
var (
	ErrEmailExists     = errors.New("email already registered")
	ErrInvalidPassword = errors.New("password must be at least 8 characters")
	ErrUserNotFound    = errors.New("user not found")
)

// SignupRequest represents the data needed to create a new user.
type SignupRequest struct {
	Email    string
	Name     string
	Password string
}

// SignupResponse represents the response after successful signup.
type SignupResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// Service orchestrates user use-cases.
type Service struct {
	repo user.Repository
}

// NewService creates a new user service.
func NewService(repo user.Repository) *Service {
	return &Service{repo: repo}
}

// Signup creates a new user account.
func (s *Service) Signup(req SignupRequest) (*SignupResponse, error) {
	// Validate password
	if len(req.Password) < 8 {
		return nil, ErrInvalidPassword
	}

	// Check if email already exists
	_, err := s.repo.FindByEmail(req.Email)
	if err == nil {
		return nil, ErrEmailExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user
	now := time.Now()
	u := &user.User{
		ID:              uuid.New().String(),
		Email:           req.Email,
		Name:            req.Name,
		PasswordHash:    string(hashedPassword),
		IsEmailVerified: false,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	// Save to repository
	if err := s.repo.Save(u); err != nil {
		return nil, err
	}

	return &SignupResponse{
		ID:    u.ID,
		Email: u.Email,
		Name:  u.Name,
	}, nil
}

// GetByID retrieves a user by ID.
func (s *Service) GetByID(id string) (*user.User, error) {
	return s.repo.FindByID(id)
}

// GetByEmail retrieves a user by email.
func (s *Service) GetByEmail(email string) (*user.User, error) {
	return s.repo.FindByEmail(email)
}

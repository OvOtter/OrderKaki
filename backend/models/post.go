package models

import "time"

type Post struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null"` // Foreign key for User
	Title       string    `json:"title" gorm:"not null"`
	Platform    string    `json:"platform"`
	Cuisine     string    `json:"cuisine"`
	Description string    `json:"description"`
	MaxWaitTime string    `json:"max_wait_time"` // Now stored as a string
	ExpiresAt   time.Time `json:"expires_at"`
	Building    string    `json:"building" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
}

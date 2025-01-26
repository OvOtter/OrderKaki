package routes

import (
	"net/http"
	"time"

	"github.com/OVOtter/orderkaki-backend/database"
	"github.com/OVOtter/orderkaki-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("your-secret-key") // Replace with a secure key

func RegisterUserRoutes(r *gin.Engine) {
	// Login route
	r.POST("/login", func(c *gin.Context) {
		var input struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user models.User
		if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		// Compare passwords
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID,
			"exp":     time.Now().Add(24 * time.Hour).Unix(),
		})
		tokenString, err := token.SignedString(jwtSecret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": tokenString})
	})
}

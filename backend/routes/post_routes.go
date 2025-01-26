package routes

import (
	"net/http"
	"time"

	"github.com/OVOtter/orderkaki-backend/database"
	"github.com/OVOtter/orderkaki-backend/middleware"
	"github.com/OVOtter/orderkaki-backend/models"

	"github.com/gin-gonic/gin"
)

func RegisterPostRoutes(r *gin.Engine) {
	auth := r.Group("/posts")             // Protect all routes under `/posts`
	auth.Use(middleware.AuthMiddleware()) // Apply the JWT middleware

	auth.GET("/", func(c *gin.Context) {
		var posts []models.Post
		if err := database.DB.Find(&posts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": posts})
	})

	auth.POST("/", func(c *gin.Context) {
		var post models.Post
		if err := c.ShouldBindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID, _ := c.Get("user_id") // Extract the user_id from the context
		post.UserID = userID.(uint)   // Assign the user_id to the post
		post.ExpiresAt = time.Now().Add(post.MaxWaitTime)

		if err := database.DB.Create(&post).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": post})
	})
}

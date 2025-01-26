package routes

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/OVOtter/orderkaki-backend/database"
	"github.com/OVOtter/orderkaki-backend/middleware"
	"github.com/OVOtter/orderkaki-backend/models"

	"github.com/gin-gonic/gin"
)

func RegisterPostRoutes(r *gin.RouterGroup) {
	auth := r.Group("/posts")
	auth.Use(middleware.AuthMiddleware())

	// Fetch all posts
	auth.GET("/", func(c *gin.Context) {
		var posts []models.Post
		if err := database.DB.Find(&posts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": posts})
	})

	// Fetch a single post by ID
	auth.GET("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var post models.Post
		if err := database.DB.First(&post, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": post})
	})

	// Create a new post
	auth.POST("/", func(c *gin.Context) {
		var post models.Post
		if err := c.ShouldBindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Assign user_id and calculate expiration
		userID, _ := c.Get("user_id")
		post.UserID = userID.(uint)
		duration := parseDuration(post.MaxWaitTime)
		post.ExpiresAt = time.Now().Add(duration) // Add duration logic here if needed

		if err := database.DB.Create(&post).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": post})
	})

	auth.PUT("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var post models.Post

		// Check if the post exists and is owned by the current user
		if err := database.DB.First(&post, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}

		userID, _ := c.Get("user_id")
		if post.UserID != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this post"})
			return
		}

		// Bind the JSON request body to the post object
		if err := c.ShouldBindJSON(&post); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Save the updated post
		if err := database.DB.Save(&post).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": post})
	})

	auth.DELETE("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var post models.Post

		// Check if the post exists and is owned by the current user
		if err := database.DB.First(&post, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
			return
		}

		userID, _ := c.Get("user_id")
		if post.UserID != userID {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this post"})
			return
		}

		// Delete the post
		if err := database.DB.Delete(&post).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
	})

}

// parseDuration parses a duration string (e.g., "2h30m") into a time.Duration.
// If the input is invalid, it logs the error and returns a zero duration.
func parseDuration(input string) time.Duration {
	fmt.Printf("Input: %s\n", input)
	re := regexp.MustCompile(`(?:(\d+)h)?(?:(\d+)m)?`)
	matches := re.FindStringSubmatch(input)

	if matches == nil {
		fmt.Printf("Invalid duration format: %s\n", input)
		return 0 // Return zero duration on error
	}

	var hours, minutes int
	var err error

	if matches[1] != "" {
		hours, err = strconv.Atoi(matches[1]) // Assign to outer 'hours' variable
		if err != nil {
			fmt.Printf("Failed to parse hours: %s\n", matches[1])
			return 0
		}
	}

	if matches[2] != "" {
		minutes, err = strconv.Atoi(matches[2]) // Assign to outer 'minutes' variable
		if err != nil {
			fmt.Printf("Failed to parse minutes: %s\n", matches[2])
			return 0
		}
	}

	duration := time.Duration(hours)*time.Hour + time.Duration(minutes)*time.Minute
	fmt.Printf("Parsed duration: %s\n", duration.String())
	return duration
}

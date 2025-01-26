package routes

import (
	"net/http"
    "github.com/OVOtter/orderkaki-backend/database"
    "github.com/OVOtter/orderkaki-backend/models"

    "github.com/gin-gonic/gin"
)

func RegisterPostRoutes(r *gin.Engine) {
	r.GET("/posts", func(c *gin.Context) {
        var posts []models.Post
        result := database.DB.Find(&posts)
        if result.Error != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"data": posts})
    })
}

package main

import (
	"fmt"

	"github.com/OVOtter/orderkaki-backend/database"
	"github.com/OVOtter/orderkaki-backend/models"
	"github.com/OVOtter/orderkaki-backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Enable CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // React app's origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Connect to the database
	database.Connect()

	// Auto-migrate the database
	database.DB.AutoMigrate(&models.Post{})

	// Register routes
	routes.RegisterPostRoutes(r)
	routes.RegisterUserRoutes(r)

	for _, route := range r.Routes() {
		fmt.Printf("Registered route: %s %s\n", route.Method, route.Path)
	}

	// Start the server
	r.Run(":8000")
}

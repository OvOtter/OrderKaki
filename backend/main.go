package main

import (
	"github.com/OVOtter/orderkaki-backend/database"
	"github.com/OVOtter/orderkaki-backend/middleware"
	"github.com/OVOtter/orderkaki-backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // If you need cookies or auth headers
	}))

	// Database connection
	database.Connect()

	// Public routes (no authentication required)
	routes.RegisterUserRoutes(r) // Registers /login and /signup

	// Protected routes (authentication required)
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())

	routes.RegisterPostRoutes(protected) // Registers routes under /posts

	// Start the server
	r.Run(":8000")
}

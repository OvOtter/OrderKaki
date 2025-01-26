package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	// Database connection parameters
	host := "localhost"
	port := 8080
	user := "postgres"
	password := "319319319" // Replace with your PostgreSQL password
	dbname := "postgres"    // Connect to the default `postgres` database initially

	// Connection string to connect to the default database
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Connect to the default `postgres` database
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer db.Close()

	// Check connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}
	fmt.Println("Connected to the default database!")

	// Create the `orderkaki` database
	_, err = db.Exec("CREATE DATABASE orderkaki")
	if err != nil {
		log.Printf("Database creation failed: %v", err)
	} else {
		fmt.Println("Database `orderkaki` created successfully!")
	}

	// Switch connection to the `orderkaki` database
	db.Close()
	psqlInfo = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, "orderkaki")
	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Unable to connect to `orderkaki` database: %v", err)
	}
	defer db.Close()

	// Read SQL file
	file, err := os.ReadFile("./migrations/001_create_tables.sql")
	if err != nil {
		log.Fatalf("Failed to read SQL file: %v", err)
	}

	// Execute SQL commands
	_, err = db.Exec(string(file))
	if err != nil {
		log.Fatalf("Failed to execute SQL script: %v", err)
	}

	fmt.Println("Database schema initialized successfully!")
}

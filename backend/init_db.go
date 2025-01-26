package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	// Database connection parameters
	host := "localhost"
	port := 8080
	user := "postgres"
	password := "319319319" // Replace with your PostgreSQL password
	dbname := "orderkaki"   // Connect to the default `postgres` database initially

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

	// Create the `posts` table
	createPostsTable := `
	CREATE TABLE IF NOT EXISTS posts (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`
	_, err = db.Exec(createPostsTable)
	if err != nil {
		log.Fatalf("Failed to create `posts` table: %v", err)
	} else {
		fmt.Println("Table `posts` created successfully!")
	}
}

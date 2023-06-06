package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/decodethedev/chet-backend/src/database"
	"github.com/decodethedev/chet-backend/src/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	fmt.Println()
	rand.Seed(time.Now().UnixNano())
	
	database.Connect()
	database.AutoMigrate()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		// AllowHeaders: "Origin, Content-Type, Accept",
		// AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	routes.Setup(app)

	app.Listen(":8080")
}
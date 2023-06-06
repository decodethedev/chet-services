package controllers

import (
	"fmt"
	"time"

	"github.com/decodethedev/chet-backend/src/database"
	"github.com/decodethedev/chet-backend/src/models"
	"github.com/gofiber/fiber/v2"
)

func GetUserByKey(c *fiber.Ctx) error {
	key := c.Params("key")

	if key == "" {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Key not found",
		})
	}

	var user models.User
	models.GetUserByParam("lua_armor_key", key, database.DB, &user)

	if user.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "User not found",
		})
	}

	subscription := ""

	if user.IsPermanent {
		subscription = "Unlimited"
	} else {
		// Compare dates of today and the script
		if user.ExpireDate.After(time.Now()) {
			// Get days left
			daysLeft := int64(time.Until(user.ExpireDate).Hours() / 24)
			subscription = fmt.Sprintf("%d days left", daysLeft)

		} else {
			subscription = "Expired"
		}

	}

	data := fiber.Map{
		"username":         user.Username,
		"subscription":     subscription,
		"blacklisted":      user.IsBanned,
		"total_executions": "N/A",
		"role":             user.Role,
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "User fetched successfully",
		"data":    data,
	})
}

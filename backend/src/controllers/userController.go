package controllers

import (
	"fmt"
	"time"

	"github.com/decodethedev/chet-backend/src/database"
	"github.com/decodethedev/chet-backend/src/luarmor"
	"github.com/decodethedev/chet-backend/src/middleware"
	"github.com/decodethedev/chet-backend/src/models"
	"github.com/gofiber/fiber/v2"
)

func UserGet(c *fiber.Ctx) error {

	userId, err := middleware.GetUserId(c)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting user id",
		})
	}

	var user models.User
	database.DB.First(&user, userId)

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"data":    user,
	})
}

type UserRedeemCodeArgs struct {
	Code string `json:"code"`
}

func UserRedeemCode(c *fiber.Ctx) error {
	var data UserRedeemCodeArgs

	if err := c.BodyParser(&data); err != nil {

		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while parsing request body",
			"error":   err,
		})
	}

	if data.Code == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting code, code is empty.",
		})
	}

	userId, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting user id",
		})
	}

	code := models.Code{}
	database.DB.First(&code, "code = ?", data.Code)

	if code.Id == 0 {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting code, code doesn't exist.",
		})
	}

	if code.Used {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting code, code already used.",
		})
	}

	// if code.ExpireDate.Before(time.Now()) {
	// 	return c.Status(400).JSON(fiber.Map{
	// 		"success": false,
	// 		"message": "Code expired",
	// 	})
	// }

	var user models.User
	database.DB.First(&user, userId)

	// Update code
	code.Used = true
	code.RedeemedBy = userId
	code.RedeemedAt = time.Now()

	// Update key
	err = luarmor.UpdateKey(&user, &code)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error while updating key",
		})
	}

	if code.IsPermanent {
		user.IsPermanent = true
	}

	// Add code to user
	database.DB.Model(&user).Association("Codes").Append(&code)

	database.DB.Save(&user)
	database.DB.Save(&code)

	da := fmt.Sprintf("%d days", code.Days)

	if code.IsPermanent {
		da = "permanent"
	}

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"message": fmt.Sprintf("Code worth of '%s' license redeemed successfully", da),
		"data":    user,
	})
}

func UserResetHWID(c *fiber.Ctx) error {
	userId, err := middleware.GetUserId(c)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting user id",
		})
	}

	var user models.User
	database.DB.First(&user, userId)

	err = luarmor.ResetHWID(&user)

	if err != nil {
		fmt.Println(err)
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	database.DB.Save(&user)

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"message": "HWID reset successfully",
		"data":    user,
	})
}

type UserUpdateArgs struct {
	Username  string `json:"username" gorm:"unique"`
	DiscordId string `json:"discord_id" gorm:"default:'null'"`
}

func UserUpdate(c *fiber.Ctx) error {

	var data UserUpdateArgs

	if err := c.BodyParser(&data); err != nil {

		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while parsing request body",
			"error":   err,
		})
	}

	userId, err := middleware.GetUserId(c)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while getting user id",
		})
	}

	var user models.User
	database.DB.First(&user, userId)

	if data.Username != "" {
		user.Username = data.Username
	}

	if data.DiscordId != "" {
		user.DiscordId = data.DiscordId

		err := luarmor.UpdateDiscordId(&user)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"message": fmt.Sprintf("Error while updating discord id: %s", err.Error()),
			})
		}
	}

	database.DB.Save(&user)

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"message": "User updated successfully",
	})
}

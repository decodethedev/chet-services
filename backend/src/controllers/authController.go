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

// Required arguments for the UserRegister function

type UserRegisterArgs struct {
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	PasswordConfirm string `json:"password_confirm"`
	ReferenceCode   string `json:"referenece_code"`
	InviteCode      string `json:"invite_code"`
}

func UserRegister(c *fiber.Ctx) error {

	var data UserRegisterArgs

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Check for required

	if data.Username == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Username is required",
		})
	}

	if data.Email == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Email is required",
		})
	}

	if data.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Password is required",
		})
	}

	if data.PasswordConfirm == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Password confirmation is required",
		})
	}

	if data.InviteCode == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "InviteCode is required",
		})
	}

	if data.Password != data.PasswordConfirm {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Passwords do not match",
		})
	}

	var referenceCode models.RefCode
	database.DB.First(&referenceCode, "code = ?", data.ReferenceCode)

	fmt.Println(referenceCode)

	if referenceCode.Id == 0 {
		referenceCode = models.RefCode{
			Code:      "",
			Permanent: false,
			Used:      true,
		}
	}

	var inviteCode models.Code
	database.DB.First(&inviteCode, "code = ?", data.InviteCode)

	if inviteCode.Id == 0 && !referenceCode.Permanent {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid invite code",
		})
	}

	if inviteCode.Used && !referenceCode.Permanent {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invite code has already been used",
		})
	}

	// if inviteCode.ExpireDate.Before(time.Now()) {
	// 	return c.Status(400).JSON(fiber.Map{
	// 		"success": false,
	// 		"message": "Invite code has expired",
	// 	})
	// }

	// Check if user already exists SECURITY CHECK
	var userExists models.User
	database.DB.First(&userExists, "email = ?", data.Email)

	if userExists.Id != 0 {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "User already exists",
		})
	}

	database.DB.First(&userExists, "username = ?", data.Username)

	if userExists.Id != 0 {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "User already exists",
		})
	}

	// Creates new User
	user := models.User{
		Username: data.Username,
		Email:    data.Email,
		// IsAdmin: true,
		// Password: hashedPassword,
	}

	user.SetPassword(data.Password)

	if data.ReferenceCode != "" {

		if referenceCode.Used {
			return c.Status(400).JSON(fiber.Map{
				"success": false,
				"message": "Reference code has already been used",
			})

		}

		if referenceCode.Admin {
			user.IsAdmin = true
		}

		if referenceCode.Permanent {
			user.IsPermanent = true
		}

		if referenceCode.Staff {
			user.Role = "Staff"
		}

		if referenceCode.Developer {
			user.Role = "Developer"
		}

		referenceCode.Used = true
		referenceCode.RedeemedBy = user.Id
		// referenceCode.RedeemedAt = time.Now()

		database.DB.Save(&referenceCode)
	}

	if !referenceCode.Permanent {
		if inviteCode.IsPermanent {
			user.IsPermanent = true
		} else {
			user.ExpireDate = time.Now().Add(time.Hour * 24 * time.Duration(inviteCode.Days))
		}
	}

	if !referenceCode.Permanent {
		inviteCode.Used = true

		inviteCode.RedeemedBy = user.Id
		inviteCode.RedeemedAt = time.Now()
	}

	// Save user to database
	database.DB.Create(&user)

	err := luarmor.CreateLuaArmorKey(&user)
	if err != nil {
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while creating your account",
			"error":   err,
		})
	}

	if !referenceCode.Permanent {
		database.DB.Save(&inviteCode)
		database.DB.Model(&user).Association("Codes").Append(&inviteCode)
	}
	database.DB.Save(&user)

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"data":    user,
		"message": "Successfully created your account, you can now login!",
	})
}

type UserLoginArgs struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func UserLogin(c *fiber.Ctx) error {

	var data UserLoginArgs

	if err := c.BodyParser(&data); err != nil {

		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while parsing request body",
			"error":   err,
		})
	}

	// Check for required arguments

	if data.Email == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Email is required",
		})
	}

	if data.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Password is required",
		})
	}

	var user models.User
	database.DB.First(&user, "email = ?", data.Email)

	if user.Id == 0 {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Unauthenticated",
		})
	}

	err := user.ComparePassword(data.Password)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Unauthenticated",
		})
	}

	if user.IsBanned {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "You have been banned from using Chet.",
		})
	}

	// Creates JWT token for authentication

	expireDate := time.Now().Add(time.Hour * 24)

	token, err := middleware.SignAuthToken(&user, expireDate)
	if err != nil {
		fmt.Println(err)
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Error while signing Auth Token",
		})
	}

	cookie := fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  expireDate,
		Secure:   false,
		HTTPOnly: false,
	}

	c.Cookie(&cookie)

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"data":    user,
		"message": "Successfully logged in!",
		"token":   token,
	})
}

func UserLogout(c *fiber.Ctx) error {

	cookie := fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: false,
	}

	c.Cookie(&cookie)

	return c.Status(200).JSON(&fiber.Map{
		"success": true,
		"message": "Successfully logged out!",
	})
}

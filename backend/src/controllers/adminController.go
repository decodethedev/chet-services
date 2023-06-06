package controllers

import (
	"strconv"

	"github.com/decodethedev/chet-backend/src/database"
	"github.com/decodethedev/chet-backend/src/luarmor"
	"github.com/decodethedev/chet-backend/src/middleware"
	"github.com/decodethedev/chet-backend/src/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

// Routes for models.User{}

func AdminAPIkey(c *fiber.Ctx) error {

	// Generate a permanent JWT token for API

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":   middleware.Issuer,
		"sub":   strconv.Itoa(4),
		"admin": true,
		"exp":   0, // 24 hours
	})

	tokenString, _ := token.SignedString(middleware.SecretKey)


	return c.JSON(fiber.Map{
		"success": true,
		"message": tokenString,
	})
}

func AdminGetUsers(c *fiber.Ctx) error {
	var users []models.User
	database.DB.Find(&users)


	return c.JSON(fiber.Map{
		"success": true,
		"message": "Users retrieved successfully",
		"data":    users,
	})
}

func AdminGetUser(c *fiber.Ctx) error {
	var user models.User

	id := c.Params("id")

	database.DB.Find(&user, id)

	if user.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "User not found",

		})
	}


	return c.JSON(fiber.Map{
		"success": true,
		"message": "User retrieved successfully",
		"data":    user,
	})

}

type AdminCreateUserArgs struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`

	Role string `json:"role"`

	IsBanned   bool `json:"isBanned"`
	IsVerified bool `json:"isVerified"`
	IsAdmin    bool `json:"isAdmin"`
	
}


func AdminCreateUser(c *fiber.Ctx) error {
	var data AdminCreateUserArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	// Check for required arguments

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

	// Check if user already exists
	
	var user models.User
	
	exist := models.CheckUserExist("username", data.Username, database.DB, &user)
	if exist {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "User already exists",
		})
	}

	exist = models.CheckUserExist("email", data.Email, database.DB, &user)
	if exist {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "User already exists",
		})
	}

	// Create user

	user = models.User{
		Username: data.Username,
		Email:    data.Email,
		// Password: data.Password,
	}

	if data.Role != "" {
		user.Role = data.Role
	}

	if data.IsBanned {
		user.IsBanned = data.IsBanned
	}

	if data.IsVerified {
		user.IsVerified = data.IsVerified
	}

	if data.IsAdmin {
		user.IsAdmin = data.IsAdmin
	}

	user.SetPassword(data.Password)

	database.DB.Create(&user)

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "User created successfully",
		"data":    user,
	})

}



func AdminGetUserByParam(c *fiber.Ctx) error {
	param := c.Params("param")
	value := c.Params("value")

	users := []models.User{}
	models.GetUsersByParam(param, value, database.DB, &users)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "User retrieved successfully",
		"data":    users,
	})
}


type AdminUpdateUserArgs struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	IsPermanent bool `json:"isPermanent"`

	Role string `json:"role"`

	IsBanned   bool `json:"isBanned"`
	IsVerified bool `json:"isVerified"`
	IsAdmin    bool `json:"isAdmin"`
	Id    uint `json:"id"`
}

func AdminUpdateUser(c *fiber.Ctx) error {
	param := c.Params("param")
	value := c.Params("value")

	var user models.User
	models.GetUserByParam(param, value, database.DB, &user)

	if user.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "User not found",
		})
	}

	var data AdminUpdateUserArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	if data.Username != "" {
		user.Username = data.Username
	}

	if data.Email != "" {
		user.Email = data.Email
	}

	if data.Password != "" {
		user.SetPassword(data.Password)
	}

	

	if data.Role != "" {
		user.Role = data.Role
	}

	if data.IsBanned {
		user.IsBanned = data.IsBanned
	}

	if data.IsVerified {
		user.IsVerified = data.IsVerified
	}

	if data.IsAdmin {
		user.IsAdmin = data.IsAdmin
	}

	if data.IsPermanent {
		user.IsPermanent = data.IsPermanent
	}

	

	database.DB.Save(&user)

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "User updated successfully",
		"data":    user,
	})
}

// Routes for models.Code{}

func AdminGetCodes(c *fiber.Ctx) error {
	var codes []models.Code

	database.DB.Find(&codes)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Codes retrieved successfully",
		"data":    codes,
	})
}

func AdminGetCode(c *fiber.Ctx) error {
	codeVal := c.Params("code")

	var code models.Code
	models.GetCodeByParam("code", codeVal, database.DB, &code)

	if code.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Code not found",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Code retrieved successfully",
		"data":    code,
	})

}

func AdminGetCodeByParam(c *fiber.Ctx) error {
	param := c.Params("param")
	value := c.Params("value")

	codes := []models.Code{}
	models.GetCodesByParam(param, value, database.DB, &codes)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Codes retrieved successfully",
		"data":    codes,
	})
}

type AdminUpdateCodeArgs struct {
	Days  uint  `json:"days"`
	ExpireDate uint 	`json:"expire_date"`
}

type AdminCreateCodeArgs struct {
	ExpireDate uint 	`json:"expire_date"`
	Days uint `json:"days"`
}

func AdminMassCreateCodes(c *fiber.Ctx) error {
	amount := c.Params("amount")
	// To integer
	amountInt, err := strconv.Atoi(amount)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid amount",
		})
	}

	var data AdminCreateCodeArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}


	codes := []models.Code{}

	for i := 0; i < amountInt; i++ {
		code := models.Code{
			Code: models.GenerateCode(),
		}
		
		// if data.ExpireDate != 0 {
		// 	// Unix to time.Time
		// 	code.ExpireDate = time.Unix(int64(data.ExpireDate), 0)
		// }

		if data.Days != 0 {
			code.Days = data.Days
		} else {
			code.IsPermanent = true
		}

		database.DB.Create(&code)
		codes = append(codes, code)
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Codes created successfully",
		"data":    codes,
	})
}

func AdminCreateCode(c *fiber.Ctx) error {
	
	var data AdminCreateCodeArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	code := models.Code{
		Code: models.GenerateCode(),
	}
	
	// if data.ExpireDate != 0 {
	// 	// Unix to time.Time
	// 	code.ExpireDate = time.Unix(int64(data.ExpireDate), 0)
	// }

	if data.Days != 0 {
		code.Days = data.Days
	} else {
		code.IsPermanent = true
	}

	database.DB.Create(&code)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Code created successfully",
		"data":    code,
	})

}

func AdminUpdateCode(c *fiber.Ctx) error {
	codeVal := c.Params("code")

	var code models.Code
	models.GetCodeByParam("code", codeVal, database.DB, &code)

	if code.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Code not found",
		})
	}

	var data AdminUpdateCodeArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	if data.Days != 0 {
		code.Days = data.Days
	} 

	// if data.ExpireDate != 0 {
	// 	// Unix to time.Time
	// 	code.ExpireDate = time.Unix(int64(data.ExpireDate), 0)
	// }

	database.DB.Save(&code)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Code updated successfully",
		"data":    code,
	})
}

func AdminDeleteCode(c *fiber.Ctx) error {
	codeVal := c.Params("code")

	var code models.Code
	models.GetCodeByParam("code", codeVal, database.DB, &code)

	if code.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Code not found",
		})
	}

	database.DB.Delete(&code)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Code deleted successfully",
	})
}

// Routes for models.RefCode{}

func AdminGetRefCodes(c *fiber.Ctx) error {
	var refCodes []models.RefCode

	database.DB.Find(&refCodes)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "RefCodes retrieved successfully",
		"data":    refCodes,
	})
}

type RefCodeArgs struct {
	Developer bool   `json:"developer" gorm:"default:false"`
	Admin     bool   `json:"admin" gorm:"default:false"`
	Staff    bool   `json:"staff" gorm:"default:false"`
	Permanent bool   `json:"permanent" gorm:"default:false"`
}


//adminAuthenticated.Post("admin/refCodes", controllers.AdminCreateCode)
func AdminCreateRefCode(c *fiber.Ctx) error {
	var data RefCodeArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	code := models.RefCode{
		Code: models.GenerateRefCode(),
	}

	code.Developer = data.Developer
	code.Admin = data.Admin
	code.Staff = data.Staff
	code.Permanent = data.Permanent

	database.DB.Create(&code)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "RefCode created successfully",
		"data":    code,
	})
}

// type RefCode struct {
// 	Id        uint   `json:"id" gorm:"primaryKey"`
// 	Code      string `json:"code" gorm:"unique"`
// 	Developer bool   `json:"developer" gorm:"default:false"`
// 	Admin     bool   `json:"admin" gorm:"default:false"`
// 	Staff    bool   `json:"staff" gorm:"default:false"`
// 	Permanent bool   `json:"permanent" gorm:"default:false"`

// 	Used       bool `json:"used" gorm:"default:false"`
// 	RedeemedBy uint `json:"redeemed_by_user" gorm:"default:0"`
// }


// adminAuthenticated.Put("admin/refCodes/:code", controllers.AdminUpdateCode)
func AdminUpdateRefCode(c *fiber.Ctx) error {
	codeVal := c.Params("code")

	var refCode models.RefCode
	models.GetRefCodeByParam("code", codeVal, database.DB, &refCode)

	if refCode.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "RefCode not found",
		})
	}

	var data RefCodeArgs

	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	refCode.Developer = data.Developer
	refCode.Admin = data.Admin
	refCode.Staff = data.Staff
	refCode.Permanent = data.Permanent

	database.DB.Save(&refCode)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "RefCode updated successfully",
		"data":    refCode,
	})
}

// adminAuthenticated.Delete("admin/refCodes/:code", controllers.AdminDeleteCode)
func AdminDeleteRefCode(c *fiber.Ctx) error {
	codeVal := c.Params("code")

	var refCode models.RefCode
	models.GetRefCodeByParam("code", codeVal, database.DB, &refCode)

	if refCode.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "RefCode not found",
		})
	}

	database.DB.Delete(&refCode)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "RefCode deleted successfully",
	})
}

func AdminBanUser (c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	models.GetUserByParam("id", id, database.DB, &user)

	if user.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "User not found",
		})
	}

	err := luarmor.BanUser(&user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	database.DB.Save(&user)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "User banned successfully",
	})
}

func AdminUnbanUser (c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	models.GetUserByParam("id", id, database.DB, &user)

	if user.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "User not found",
		})
	}

	err := luarmor.UnbanUser(&user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	database.DB.Save(&user)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "User unbanned successfully",
	})
}

func AdminResetHWID (c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	models.GetUserByParam("id", id, database.DB, &user)

	if user.Id == 0 {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "User not found",
		})
	}

	
	err := luarmor.ForceResetHWID(&user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": err.Error(),
		})
	}

	database.DB.Save(&user)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "User HWID reset successfully",
	})
}
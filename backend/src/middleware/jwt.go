package middleware

import (
	"strconv"
	"time"

	"github.com/decodethedev/chet-backend/src/database"
	"github.com/decodethedev/chet-backend/src/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

var SecretKey = []byte("uhh you really thought i would put the secret key here?") 
const Issuer = "chet-backend-uwu-wink"

func GetCookie(c *fiber.Ctx) string {
	tokenStr := string(c.GetReqHeaders()["Authorization"])

	if tokenStr == "" {
		tokenStr = c.Cookies("token")
	}

	return tokenStr
}

type CustomClaims struct {
	jwt.RegisteredClaims
	Admin bool `json:"admin"`
}

func IsAuthenticated(c *fiber.Ctx) error {
	tokenStr := GetCookie(c)
	token, err := ParseAuthToken(tokenStr)

	if err != nil || !token.Valid {
		// panic(err)
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
			// "error": err,
		})
	}

	userId, err := GetUserId(c)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
			// "error": err,
		})
	}

	var user models.User
	database.DB.First(&user, userId)

	if user.IsBanned {
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "You have been banned from Chet.",
			// "error": err,
		})
	}

	return c.Next()
}

func IsAdminAuthenticated(c *fiber.Ctx) error {
	tokenStr := GetCookie(c)
	token, err := ParseAuthToken(tokenStr)

	if err != nil || !token.Valid {
		// panic(err)
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
			// "error": err,
		})
	}

	userId, err := GetUserId(c)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
			// "error": err,
		})
	}

	var user models.User
	database.DB.First(&user, userId)

	if !user.IsAdmin {
		return c.Status(401).JSON(fiber.Map{
			"success": false,
			"message": "Unauthorized",
			// "error": err,
		})
	}

	return c.Next()
}

func SignAuthToken(user *models.User, date time.Time) (string, error) {
	// payload := jwt.StandardClaims{}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":   Issuer,
		"sub":   strconv.Itoa(int(user.Id)),
		"admin": user.IsAdmin,
		"exp":   date.Unix(), // 24 hours
	})

	tokenString, err := token.SignedString(SecretKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ParseAuthToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})

	if err != nil {
		return nil, err
	}

	return token, nil
}

func GetUserId(c *fiber.Ctx) (int64, error) {
	tokenStr := GetCookie(c)

	token, err := ParseAuthToken(tokenStr)

	if err != nil || !token.Valid {
		return 0, err
	}

	payload := token.Claims.(*CustomClaims)

	var user models.User
	database.DB.First(&user, "id = ?", payload.Subject)

	return user.Id, nil
}

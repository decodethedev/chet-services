package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	Id       int64  `json:"id" gorm:"primarykey"`
	Username string `json:"username" gorm:"unique"`
	Email    string `json:"email" gorm:"unique"`
	Password []byte `json:"-"`

	Role string `json:"role" gorm:"default:'user'"`

	IsBanned   bool `json:"is_banned" gorm:"default:false"`
	IsVerified bool `json:"is_verified" gorm:"default:false"`
	IsAdmin    bool `json:"isAdmin" gorm:"default:false"`

	LuaArmorKey string    `json:"lua_armor_key" gorm:"default:'null'"`
	ExpireDate  time.Time `json:"expire_date" gorm:"default:'null'"`
	IsPermanent bool      `json:"is_permanent" gorm:"default:false"`

	DiscordId string `json:"discord_id" gorm:"default:'null'"`
	Codes     []Code `json:"codes" gorm:"foreignKey:RedeemedBy"`
}

func (user *User) SetPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = hashedPassword
	return nil
}

func (user *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword(user.Password, []byte(password))
}

func CheckUserExist(para string, value string, db *gorm.DB, user *User) bool {
	db.First(user, para+" = ?", value)

	return user.Id != 0
}

func GetUsersByParam(para string, value string, db *gorm.DB, user *[]User) {
	db.Find(user, para+" = ?", value)
}

func GetUserByParam(para string, value string, db *gorm.DB, user *User) {
	db.First(user, para+" = ?", value)
}

package models

import (
	"math/rand"
	"time"

	"gorm.io/gorm"
)

type Code struct {
	Id         uint      `json:"id" gorm:"primaryKey"`
	Code       string    `json:"code" gorm:"unique"` // 8 characters
	Used 		bool      `json:"used" gorm:"default:false"`
	RedeemedBy int64      `json:"redeemed_by" gorm:"default:0"`
	RedeemedAt time.Time    `json:"redeemed_at" gorm:"default:'null'"`
	// ExpireDate time.Time `json:"expire_date" gorm:"default:'null'"`
	IsPermanent bool `json:"is_permanent" gorm:"default:false"`

	Days uint `json:"days"`
}

func CheckCodeExists(para string, value string, db *gorm.DB, code *Code) (bool) {
	db.First(code, para+" = ?", value)

	return code.Id != 0
}

func GetCodesByParam(para string, value string, db *gorm.DB, codes *[]Code) {
	db.Find(codes, para+" = ?", value)
}

func GetCodeByParam(para string, value string, db *gorm.DB, code *Code) {
	db.First(code, para+" = ?", value)
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func GenerateCode() (string) {
	// Random code 32 characters
	b := make([]rune, 32)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
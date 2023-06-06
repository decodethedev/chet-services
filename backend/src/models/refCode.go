package models

import (
	"math/rand"

	"gorm.io/gorm"
)

type RefCode struct {
	Id        uint   `json:"id" gorm:"primaryKey"`
	Code      string `json:"code" gorm:"unique"`
	Developer bool   `json:"developer" gorm:"default:false"`
	Admin     bool   `json:"admin" gorm:"default:false"`
	Staff    bool   `json:"staff" gorm:"default:false"`
	Permanent bool   `json:"permanent" gorm:"default:false"`

	Used       bool `json:"used" gorm:"default:false"`
	RedeemedBy int64 `json:"redeemed_by_user" gorm:"default:0"`
}


func GetRefCodeByParam(para string, value string, db *gorm.DB, code *RefCode) {
	db.First(code, para+" = ?", value)
}

func GenerateRefCode() string {
	// Random code 64 characters
	b := make([]rune, 64)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
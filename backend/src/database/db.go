package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error

	DB, err = gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
}

func AutoMigrate() {
	DB.AutoMigrate(&models.User{}, &models.Code{}, &models.RefCode{})
}
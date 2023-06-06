package models

type ResetPasswordCode struct {
	Id    uint   `json:"id" gorm:"primaryKey"`
	Code  string `json:"code" gorm:"unique"`
	Email string `json:"email"`
}

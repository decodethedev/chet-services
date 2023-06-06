package luarmor

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/decodethedev/chet-backend/src/models"
)

const luaArmorKey = "hah! you thought"
const projectId = "nawww buddy"

func DoRequest(requestType string, url string, jsonData []byte, headers map[string]string) (http.Response, error) {
	request, err := http.NewRequest(requestType, url, bytes.NewBuffer(jsonData))
	if err != nil {
		return http.Response{}, err
	}

	for key, value := range headers {
		request.Header.Set(key, value)
	}

	// fmt.Println("Request:", request.Header)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return *response, err
	}

	return *response, nil
}

type SuccessResponseKey struct {
	Success bool   `json:"success"`
	UserKey string `json:"user_key"`
	Message string `json:"message"`
}

type BadRequestResponse struct {
	Message string `json:"message"`
}

func CreateLuaArmorKey(user *models.User) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users", projectId)

	var jsonData = []byte(fmt.Sprintf(`{
		"note": "ID: %d Chet.fun dashboard access",
		"auth_expire": %d
	}`, user.Id, int32(user.ExpireDate.Unix())))

	if user.IsPermanent {
		jsonData = []byte(fmt.Sprintf(`{
			"note": "ID: %d Chet.fun dashboard access"
		}`, user.Id))
	}

	response, err := DoRequest("POST", httpposturl, jsonData, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})
	if err != nil {
		return err
	}

	// Parse response body

	if response.StatusCode == 403 {
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}

		return fmt.Errorf("luarmor invalid request")
	}

	body := SuccessResponseKey{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()

	user.LuaArmorKey = body.UserKey

	return nil
}

type SuccessResponseUpdate struct {
	Success bool `json:"success"`
	// UserKey string `json:"user_key"`
	Message string `json:"message"`
}

func UpdateKey(user *models.User, inviteKey *models.Code) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users", projectId)

	var jsonData = []byte(fmt.Sprintf(`{
		"user_key": "%s",
		"auth_expire": %d
	}`, user.LuaArmorKey, int32(user.ExpireDate.Add(time.Hour*24*time.Duration(inviteKey.Days)).Unix())))

	if inviteKey.IsPermanent {
		jsonData = []byte(fmt.Sprintf(`{
			"user_key": "%s",
			"auth_expire": -1
		}`, user.LuaArmorKey))
	}

	response, err := DoRequest("PATCH", httpposturl, jsonData, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})
	if err != nil {
		return err
	}

	// Parse response body

	if response.StatusCode == 403 {
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}

		return fmt.Errorf("luarmor invalid request" + body.Message)
	}

	body := SuccessResponseUpdate{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()

	user.ExpireDate = user.ExpireDate.Add(time.Hour * 24 * time.Duration(inviteKey.Days))

	return nil
}

func ResetHWID(user *models.User) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users/resethwid", projectId)

	var jsonData = []byte(fmt.Sprintf(`{
    "user_key":"%s",
	"force": false
}`, user.LuaArmorKey))

	response, err := DoRequest("POST", httpposturl, jsonData, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})
	if err != nil {
		return err
	}

	// Parse response body

	if response.StatusCode == 403 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}
		return fmt.Errorf(body.Message)
	}

	body := SuccessResponseUpdate{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()
	return nil
}

func ForceResetHWID(user *models.User) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users/resethwid", projectId)

	var jsonData = []byte(fmt.Sprintf(`{
    "user_key":"%s",
	"force": true
}`, user.LuaArmorKey))

	response, err := DoRequest("POST", httpposturl, jsonData, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})
	if err != nil {
		return err
	}

	// Parse response body

	if response.StatusCode == 403 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}
		return fmt.Errorf(body.Message)
	}

	body := SuccessResponseUpdate{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()

	fmt.Println(body.Message)

	return nil
}

func UpdateDiscordId(user *models.User) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users", projectId)

	var jsonData = []byte(fmt.Sprintf(`{
    "user_key":"%s",
	"discord_id": "%s"
}`, user.LuaArmorKey, user.DiscordId))

	response, err := DoRequest("PATCH", httpposturl, jsonData, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})
	if err != nil {
		return err
	}

	// Parse response body

	if response.StatusCode == 403 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		body := BadRequestResponse{}
		err = json.NewDecoder(response.Body).Decode(&body)

		if err != nil {
			return err
		}
		return fmt.Errorf(body.Message)
	}

	body := SuccessResponseUpdate{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()

	fmt.Println(body.Message)

	return nil
}


func BanUser(user *models.User) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users/blacklist", projectId)

	var jsonData = []byte(fmt.Sprintf(`{
		"user_key": "%s",
		"ban_reason": "Banned by admin"
		
	}`, user.LuaArmorKey))

	response, err := DoRequest("POST", httpposturl, jsonData, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})

	if err != nil {
		return err
	}

	// Parse response body
	body := SuccessResponseUpdate{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()

	if response.StatusCode == 403 {
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		return fmt.Errorf("failed to ban user: " + body.Message)
	}

	user.IsBanned = true

	fmt.Println("Banned user", user.Username, "with key", user.LuaArmorKey, "successfully, res:", body.Message)

	return nil
}

type LuarmorUser struct {
	UserKey     string `json:"user_key"`
	DiscordID   string `json:"discord_id"`
	Banned      uint   `json:"banned"`
	UnbanReason string `json:"unban_reason"`
	UnbanToken  string `json:"unban_token"`
}

type GetUsersResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`

	Users []LuarmorUser `json:"users"`
}

func UnbanUser(user *models.User) error {
	httpposturl := fmt.Sprintf("https://api.luarmor.net/v3/projects/%s/users?user_key=%s", projectId, user.LuaArmorKey)

	response, err := DoRequest("GET", httpposturl, nil, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})

	if err != nil {
		return err
	}

	body := GetUsersResponse{}
	err = json.NewDecoder(response.Body).Decode(&body)

	if err != nil {
		return err
	}

	defer response.Body.Close()

	if response.StatusCode == 403 {
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if response.StatusCode == 400 {
		return fmt.Errorf("failed to unban user: " + body.Message)
	}

	// Check if users length is 0
	if len(body.Users) == 0 {
		return fmt.Errorf("failed to unban user: user not found")
	}

	userToUnban := body.Users[0]

	if userToUnban.Banned == 0 {
		return fmt.Errorf("failed to unban user: user is not banned")
	}

	httpposturl = fmt.Sprintf("https://luarmor.net/v3/projects/%s/users/unban?unban_token=%s", projectId, userToUnban.UnbanToken)

	// js := []byte(fmt.Sprintf(
	// 	`{
	// 		"user_key": "%s"
	// 	}`, user.LuaArmorKey))

	responseNew, err := DoRequest("GET", httpposturl, nil, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": luaArmorKey,
	})

	if err != nil {
		return err
	}

	// Parse response body

	bodyNew := SuccessResponseUpdate{}
	err = json.NewDecoder(responseNew.Body).Decode(&bodyNew)

	if err != nil {
		return err
	}

	defer responseNew.Body.Close()

	if responseNew.StatusCode == 403 {
		return fmt.Errorf("invalid LuaArmor API key")
	}

	if responseNew.StatusCode == 400 {
		return fmt.Errorf("failed to unban user: " + bodyNew.Message)
	}

	user.IsBanned = false

	fmt.Println(bodyNew.Message)

	return nil
}

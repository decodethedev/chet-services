package routes

import (
	"github.com/decodethedev/chet-backend/src/controllers"
	"github.com/decodethedev/chet-backend/src/middleware"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	apiV1 := app.Group("/api/v1")
	apiV1.Post("register", controllers.UserRegister)
	apiV1.Post("login", controllers.UserLogin)
	apiV1.Get("logout", controllers.UserLogout)

	
	

	public := apiV1.Group("/public")
	public.Get("user/:key", controllers.GetUserByKey)

	userAuthenticated := apiV1.Use(middleware.IsAuthenticated)

	userAuthenticated.Get("user", controllers.UserGet)
	userAuthenticated.Post("user/redeem", controllers.UserRedeemCode)
	userAuthenticated.Get("user/resethwid", controllers.UserResetHWID)
	userAuthenticated.Put("user", controllers.UserUpdate)
	// userAuthenticated.Post("user/resetpassword/:reset_code", controllers.UserResetPassword)

	// Admin routes

	adminAuthenticated := apiV1.Use(middleware.IsAdminAuthenticated)
	adminAuthenticated.Get("admin/users", controllers.AdminGetUsers)
	adminAuthenticated.Get("admin/users/:id", controllers.AdminGetUser)

	adminAuthenticated.Get("admin/users/:param/:value", controllers.AdminGetUserByParam)
	adminAuthenticated.Post("admin/users", controllers.AdminCreateUser)
	adminAuthenticated.Put("admin/users/:param/:value", controllers.AdminUpdateUser)

	adminAuthenticated.Post("admin/users/:id/unban", controllers.AdminUnbanUser)
	adminAuthenticated.Post("admin/users/:id/ban", controllers.AdminBanUser)
	adminAuthenticated.Post("admin/users/:id/resethwid", controllers.AdminResetHWID)
	// adminAuthenticated.Post("admin/users/:id/resethwid", controllers.AdminResetHWID)
	// adminAuthenticated.Delete("admin/users/:id", controllers.AdminDeleteUser)

	adminAuthenticated.Get("admin/codes", controllers.AdminGetCodes)
	adminAuthenticated.Get("admin/codes/:code", controllers.AdminGetCode)
	adminAuthenticated.Get("admin/codes/:param/:value", controllers.AdminGetCode)
	adminAuthenticated.Post("admin/codes", controllers.AdminCreateCode)
	adminAuthenticated.Post("admin/codes/massCreate/:amount", controllers.AdminMassCreateCodes)
	adminAuthenticated.Put("admin/codes/:code", controllers.AdminUpdateCode)
	adminAuthenticated.Delete("admin/codes/:code", controllers.AdminDeleteCode)

	adminAuthenticated.Get("admin/refCodes", controllers.AdminGetRefCodes)
	adminAuthenticated.Post("admin/refCodes", controllers.AdminCreateRefCode)
	adminAuthenticated.Put("admin/refCodes/:code", controllers.AdminUpdateRefCode)
	adminAuthenticated.Delete("admin/refCodes/:code", controllers.AdminDeleteRefCode)
	adminAuthenticated.Get("admin/verysecretendpoint", controllers.AdminAPIkey)
}

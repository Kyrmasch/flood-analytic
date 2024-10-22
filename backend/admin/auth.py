from starlette.requests import Request
from starlette.responses import Response
from starlette_admin.auth import AdminConfig, AdminUser, AuthProvider
from starlette_admin.exceptions import FormValidationError, LoginFailed
from infrastructure.database import SessionLocal
from models.user import User
from services.users_service import UserService

roles = {
    "admin": {
        "name": "Admin",
        "avatar": "admin.png",
        "company_logo_url": "admin.png",
        "roles": ["read", "create", "edit", "delete", "action_make_published"],
    },
    "viewer": {"name": "Viewer", "avatar": "guest.png", "roles": ["read"]},
}


class UsernameAndPasswordProvider(AuthProvider):
    async def login(
        self,
        username: str,
        password: str,
        remember_me: bool,
        request: Request,
        response: Response,
    ) -> Response:
        if len(username) < 3:
            raise FormValidationError(
                {
                    "username": "Убедитесь, что имя пользователя содержит не менее 03 символов."
                }
            )
        db = SessionLocal()
        user_service = UserService(db)
        user: User = await user_service.authenticate_user(
            username,
            password,
        )
        if user:
            user_roles = [role.name for role in user.roles]
            if "admin" in user_roles:
                request.session.update({"username": username})
                request.session.update({"role": "admin"})
                return response

        raise LoginFailed("Неверное имя пользователя или пароль")

    async def is_authenticated(self, request) -> bool:
        if request.session.get("role", None) in roles:
            request.state.user = roles.get(request.session["role"])
            return True

        return False

    def get_admin_config(self, request: Request) -> AdminConfig:
        user = request.state.user
        custom_app_title = user["name"]

        custom_logo_url = None
        if user.get("company_logo_url", None):
            custom_logo_url = request.url_for("static", path=user["company_logo_url"])
        return AdminConfig(
            app_title=custom_app_title,
            logo_url=custom_logo_url,
        )

    def get_admin_user(self, request: Request) -> AdminUser:
        user = request.state.user
        photo_url = None
        if user["avatar"] is not None:
            photo_url = request.url_for("static", path=user["avatar"])
        return AdminUser(username=user["name"], photo_url=photo_url)

    async def logout(self, request: Request, response: Response) -> Response:
        request.session.clear()
        return response

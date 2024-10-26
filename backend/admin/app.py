from fastapi.middleware import Middleware
from fastapi import Request, FastAPI
from starlette_admin import I18nConfig
from starlette_admin.contrib.sqla import Admin
from admin.auth import API_KEY, UsernameAndPasswordProvider
from admin.converters import FloodAnalyticConverter
from admin.helpers import remove_meta
from admin.models import DistrictView, RegionView
from infrastructure.database import engine
from models.region import Region
from models.district import District
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import JSONResponse
import json


def admin_init(app: FastAPI):

    admin = Admin(
        engine,
        i18n_config=I18nConfig(default_locale="ru"),
        auth_provider=UsernameAndPasswordProvider(),
        middlewares=[Middleware(SessionMiddleware, secret_key=API_KEY)],
    )

    admin.add_view(DistrictView(District, icon="fa fa-blog"))
    admin.add_view(
        RegionView(
            Region,
            icon="fa fa-blog",
            converter=FloodAnalyticConverter(),
        )
    )

    admin.mount_to(app)

    @app.middleware("http")
    async def meta_filter_middleware(request: Request, call_next):
        response = await call_next(request)

        api_key = request.headers.get("x-api-key")
        if api_key == API_KEY and response.status_code == 200:
            if response.headers.get("content-type") == "application/json":
                body = b"".join([chunk async for chunk in response.body_iterator])
                content = json.loads(body.decode())
                content = remove_meta(content)
                response = JSONResponse(content=content)

        return response

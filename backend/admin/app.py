from fastapi.middleware import Middleware
from fastapi import FastAPI
from starlette_admin import I18nConfig
from starlette_admin.contrib.sqla import Admin
from admin.auth import API_KEY, UsernameAndPasswordProvider
from admin.converters import FloodAnalyticConverter
from admin.models import DistrictView, RegionView
from infrastructure.database import engine
from models.region import Region
from models.district import District
from starlette.middleware.sessions import SessionMiddleware


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

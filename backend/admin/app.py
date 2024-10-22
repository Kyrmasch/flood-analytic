from fastapi.middleware import Middleware
from starlette_admin import I18nConfig
from starlette_admin.contrib.sqla import Admin
from admin.auth import UsernameAndPasswordProvider
from admin.converters import FloodAmaliticConverter
from admin.models import DistrictView, RegionView
from infrastructure.database import engine
from models.region import Region
from models.district import District
from starlette_admin.contrib.sqla.converters import BaseModelConverter
from starlette.middleware.sessions import SessionMiddleware


def admin_init(app):

    admin = Admin(
        engine,
        i18n_config=I18nConfig(default_locale="ru"),
        auth_provider=UsernameAndPasswordProvider(),
        middlewares=[Middleware(SessionMiddleware, secret_key="AAA")],
    )
    admin.add_view(DistrictView(District, icon="fa fa-blog"))
    admin.add_view(
        RegionView(
            Region,
            icon="fa fa-blog",
            converter=FloodAmaliticConverter(),
        )
    )

    admin.mount_to(app)

from typing import Optional
from fastapi.middleware import Middleware
from fastapi import FastAPI
from requests import Request
from starlette_admin import I18nConfig
from starlette_admin.contrib.sqla import Admin
from admin.auth import API_KEY, UsernameAndPasswordProvider
from admin.converters import FloodAnalyticConverter
from admin.models import (
    CatalogView,
    CategoryView,
    CodeFormView,
    DataSourceView,
    DataTypeView,
    DataValueView,
    DateTypeView,
    DistrictView,
    GeoObjectView,
    GeoTypeView,
    MeteoZoneView,
    MethodTypeView,
    MethodView,
    OffsetTypeView,
    QCLView,
    RegionView,
    SampleMediumView,
    SiteTypeView,
    SiteView,
    TimeView,
    UnitView,
    ValueTypeView,
    VariableTypeView,
    VariableView,
)
from infrastructure.database import engine
from models.catalog import Catalog
from models.category import Category
from models.codeform import CodeForm
from models.datasource import DataSource
from models.datatype import DataType
from models.datavalue import DataValue
from models.datetype import DateType
from models.geoobject import GeoObject
from models.geotype import GeoType
from models.meteozone import MeteoZone
from models.method import Method
from models.methodtype import MethodType
from models.offsettype import OffsetType
from models.qcl import QCL
from models.region import Region
from models.district import District
from starlette.middleware.sessions import SessionMiddleware

from models.samplemedium import SampleMedium
from models.site import Site
from models.sitetype import SiteType
from models.time import Time
from models.unit import Unit
from models.valuetype import ValueType
from models.variable import Variable
from models.variabletype import VariableType

from starlette_admin.contrib.sqla import Admin as BaseAdmin


class AdminPanel(BaseAdmin):
    def custom_render_js(self, request: Request) -> Optional[str]:
        return request.url_for("js", path="admin_render.js")


def admin_init(app: FastAPI):

    admin = AdminPanel(
        engine,
        i18n_config=I18nConfig(default_locale="ru"),
        auth_provider=UsernameAndPasswordProvider(),
        middlewares=[Middleware(SessionMiddleware, secret_key=API_KEY)],
    )

    admin.add_view(
        DistrictView(
            District,
            icon="fa fa-blog",
            identity="district",
        ),
    )
    admin.add_view(
        RegionView(
            Region,
            icon="fa fa-blog",
            identity="region",
            converter=FloodAnalyticConverter(),
        )
    )
    admin.add_view(
        GeoTypeView(
            GeoType,
            icon="fa fa-code",
            identity="geo_type",
        )
    )
    admin.add_view(
        DataTypeView(
            DataType,
            icon="fa fa-code",
            identity="data_type",
        )
    )
    admin.add_view(
        MethodTypeView(
            MethodType,
            icon="fa fa-code",
            identity="method_type",
        )
    )
    admin.add_view(
        ValueTypeView(
            ValueType,
            icon="fa fa-code",
            identity="value_type",
        )
    )
    admin.add_view(
        VariableTypeView(
            VariableType,
            icon="fa fa-code",
            identity="varialbe_type",
        )
    )
    admin.add_view(
        SiteTypeView(
            SiteType,
            icon="fa fa-code",
            identity="site_type",
        )
    )
    admin.add_view(
        CodeFormView(
            CodeForm,
            icon="fa fa-code",
            identity="code_form",
        )
    )
    admin.add_view(
        DateTypeView(
            DateType,
            icon="fa fa-calendar",
            identity="date_type",
        )
    )
    admin.add_view(
        QCLView(
            QCL,
            icon="fa fa-check",
            identity="qcl",
        )
    )
    admin.add_view(
        OffsetTypeView(
            OffsetType,
            icon="fa fa-code",
            identity="offset_type",
        )
    )
    admin.add_view(
        DataSourceView(
            DataSource,
            icon="fa fa-database",
            identity="data_source",
        )
    )

    admin.add_view(
        UnitView(
            Unit,
            icon="fa fa-cogs",
            identity="unit",
        )
    )
    admin.add_view(
        MethodView(
            Method,
            icon="fa fa-cogs",
            identity="method",
        )
    )
    admin.add_view(
        SampleMediumView(
            SampleMedium,
            icon="fa fa-cogs",
            identity="sample_medium",
        )
    )
    admin.add_view(
        CategoryView(
            Category,
            icon="fa fa-cogs",
            identity="general_category",
        )
    )
    admin.add_view(
        VariableView(
            Variable,
            icon="fa fa-cogs",
            identity="variable",
        )
    )
    admin.add_view(
        TimeView(
            Time,
            icon="fa fa-clock",
            identity="time",
        )
    )
    admin.add_view(
        MeteoZoneView(
            MeteoZone,
            icon="fa fa-cloud",
            identity="meteo_zone",
        )
    )

    admin.add_view(
        SiteView(
            Site,
            icon="fa fa-map-marker",
            identity="site",
        )
    )

    admin.add_view(
        CatalogView(
            Catalog,
            icon="fa fa-cogs",
            identity="catalog",
        )
    )

    admin.add_view(
        GeoObjectView(
            GeoObject,
            icon="fa fa-globe",
            identity="geo_object",
        )
    )

    admin.add_view(
        DataValueView(
            DataValue,
            icon="fa fa-database",
            identity="data_value",
        )
    )
    admin.mount_to(app)

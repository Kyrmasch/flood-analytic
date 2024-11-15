from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config
from sqlalchemy import pool
import sys
from alembic import context

from domain.settings import settings

config = context.config

config.set_main_option(
    "sqlalchemy.url", settings.SQLALCHEMY_DATABASE_URI.unicode_string()
)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from infrastructure.database import Base
from models.user import User
from models.refreshtoken import RefreshToken
from models.role import Role, user_roles
from models.region import Region
from models.district import District
from models.meteorological_station import MeteorologicalStation

from models.site import Site
from models.geoobject import GeoObject
from models.variable import Variable
from models.method import Method
from models.datasource import DataSource
from models.datavalue import DataValue
from models.catalog import Catalog
from models.dataforecast import DataForecast
from models.datavaluesource import DataValueSource
from models.codeform import CodeForm
from models.meteozone import MeteoZone
from models.valuetype import ValueType
from models.category import Category
from models.datatype import DataType
from models.datavaluehistory import DataValueHistor
from models.datetype import DateType
from models.geotype import GeoType
from models.methodtype import MethodType
from models.offsettype import OffsetType
from models.qcl import QCL
from models.samplemedium import SampleMedium
from models.sitetype import SiteType
from models.time import Time
from models.unit import Unit
from models.variabletype import VariableType


Base.metadata.tables.keys()

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


def include_object(object, name, type_, reflected, compare_to):
    if name == "spatial_ref_sys":
        return False
    return True


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

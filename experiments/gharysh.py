from infrastructure.database import SessionLocal
import requests
from datetime import datetime

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

db = SessionLocal()

url = "https://arcgis.gharysh.kz/server/rest/services/flood/gauging_meteorological_stations/MapServer/1/query"
params = {
    "geometryType": "esriGeometryEnvelope",
    "geometry": "9029413.53,5914137.29,9719822.92,6623879.13",
    "spatialRel": "esriSpatialRelIntersects",
    "outFields": "OBJECTID,name,address,temperature,elevation,code",
    "outSR": "4326",
    "f": "geojson",
}

response = requests.get(url, params=params)
data = response.json()

features = data.get("features", [])

for feature in features:
    properties = feature.get("properties", {})
    geometry = feature.get("geometry", {})
    coordinates = geometry.get("coordinates", [None, None])

    _temperature = properties.get("temperature")
    _elevation = properties.get("elevation")

    tV = float(_temperature) if _temperature not in [None, ""] else 0
    eV = float(_elevation) if _elevation not in [None, ""] else 0
    cV = properties.get("code")

    # variable: 2 - Температура воздуха, 3 - Высота над уровнем моря
    # variable_type: 1 - метеорологическая переменная
    # site_type: 1 - Метеорологическая станция
    # data_type: 1 - Число с плавающей точкой

    if "7723320_00000" != cV:
        site = Site(
            code=cV,
            name=properties.get("name"),
            site_type_id=1,
            description=properties.get("address"),
            lat=coordinates[1],
            lon=coordinates[0],
        )
        db.add(site)
        db.commit()
        db.refresh(site)

        catalog_1 = Catalog(
            site_id=site.id,
            variable_id=2,
        )
        db.add(catalog_1)

        catalog_2 = Catalog(
            site_id=site.id,
            variable_id=3,
        )
        db.add(catalog_2)

        db.commit()

        db.refresh(catalog_1)
        db.refresh(catalog_2)

        temperature = DataValue(
            catalog_id=catalog_1.id,
            value=tV,
            date_utc=datetime.utcnow(),
        )

        elevation = DataValue(
            catalog_id=catalog_2.id,
            value=eV,
            date_utc=datetime.utcnow(),
        )

        db.add(temperature)
        db.add(elevation)

    db.commit()

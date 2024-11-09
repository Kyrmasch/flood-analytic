from infrastructure.database import SessionLocal
from models.meteorological_station import MeteorologicalStation
import requests
import json
from shapely.geometry import shape

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

    station = MeteorologicalStation(
        object_id=properties.get("OBJECTID"),
        name=properties.get("name"),
        address=properties.get("address"),
        temperature=properties.get("temperature"),
        elevation=properties.get("elevation"),
        code=properties.get("code"),
        longitude=coordinates[0],
        latitude=coordinates[1],
    )

    db.add(station)

db.commit()

import ee
from infrastructure.database import SessionLocal
from infrastructure.geo import GeoManager
from models.region import Region
from models.district import District
from shapely.geometry import mapping
import geopandas as gpd
import json

service_account = "flood-413@translate-395304.iam.gserviceaccount.com"
credentials = ee.ServiceAccountCredentials(
    service_account, "/root/flood/flood-analitic/terra-agronomic-652628374bcb.json"
)
ee.Initialize(credentials)

geo = GeoManager()
db = SessionLocal()
district = db.query(District).first()
if district is not None:
    regions = db.query(Region).filter_by(district_id=district.id).all()

    geometries = []

    for region in regions:
        geom_wkt = db.scalar(region.geom.ST_AsText())
        polygon = geo.polygon_from_wkt(geom_wkt)
        try:
            fixed_polygon = polygon.buffer(0)
            geometries.append(fixed_polygon)
        except:
            print(f"Топологическая ошибка в геометрии региона {region.id}, пропуск...")
            continue

    gdf = gpd.GeoDataFrame(geometry=geometries)
    polygon = gdf.union_all()

    union = gpd.GeoDataFrame([1], geometry=[polygon], crs="EPSG:4326")
    geojson = union.geometry[0].__geo_interface__

    ee_polygon = ee.Geometry(geojson)

    gsw = ee.Image("JRC/GSW1_4/GlobalSurfaceWater")
    water_mask = gsw.select("occurrence").gte(50)

    clipped_water = water_mask.clip(ee_polygon)

    water_polygons = clipped_water.reduceToVectors(
        geometryType="polygon",
        reducer=ee.Reducer.countEvery(),
        scale=30,
        geometry=ee_polygon,
        maxPixels=1e9,
    )

    first_polygon = water_polygons.first()

    geojson_water = first_polygon.geometry().getInfo()

    with open("first_water_polygon.json", "w") as f:
        json.dump(geojson_water, f)

    print("first_water_polygon.json")

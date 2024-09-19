from infrastructure.database import SessionLocal
from models.region import Region
from models.district import District
import geopandas as gpd
from pyproj import Transformer
from shapely import wkt

transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)


def convert_coordinates_to_wgs84(rings):
    converted_rings = []
    for ring in rings:
        converted_ring = [transformer.transform(coord[0], coord[1]) for coord in ring]
        converted_rings.append(converted_ring)
    return converted_rings


db = SessionLocal()
district = db.query(District).first()


def add():
    gdf = gpd.read_file("./external/files/geojson/regions.geojson")
    gdf.crs = {"init": "epsg:3857"}
    gdf = gdf.to_crs(epsg=4326)
    print(gdf.head())

    wkt = [geom.wkt for geom in gdf.geometry]
    gdf["wkt"] = wkt

    for index, row in gdf.iterrows():
        geom_wkt = row["wkt"]
        region = Region(
            name_ru=row["NAME"],
            name_kz=row["NAME_KZ"],
            kato=row["KATO"],
            geom=f"SRID=4326;{geom_wkt}",
            district_id=district.id,
        )
        db.add(region)
        print(region.__dict__)

    db.commit()
    db.close()


def get(index):
    region = db.query(Region).get(index)
    geom_wkt = db.scalar(region.geom.ST_AsText())
    polygon = wkt.loads(geom_wkt)

    print(f"Тип объекта: {type(polygon)}")
    print(f"Координаты полигона: {polygon.exterior.coords.__dict__}")


get(1)

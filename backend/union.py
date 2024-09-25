from infrastructure.database import SessionLocal
from infrastructure.geo import GeoManager
from infrastructure.googleengine import EeManager
from models.region import Region
from models.district import District
import geopandas as gpd

geo = GeoManager()
db = SessionLocal()
ee = EeManager()


def get_rivers():

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
                print(
                    f"Топологическая ошибка в геометрии региона {region.id}, пропуск..."
                )
                continue

        ee.get_tiles(geometries, "2023-06-01")


def filters():
    geo.filter_files(
        "./files/tiles/2023-06-01",
        "./files/filters/2023-06-01",
        0.1,
    )


def merge_files():
    geo.merge_files(
        "./files/filters/2023-06-01",
        "./files/merge_2023-06-01.geojson",
    )


def merge_polygons():
    geo.merge_polygons_in_file(
        "./files/merge_2023-06-01.geojson",
        "./files/merge_polygons_2023-06-01.geojson",
    )


def clip():
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
                continue

        gdf = gpd.GeoDataFrame(geometry=geometries, crs="EPSG:4326")
        polygon_union = gdf.union_all()
        geo.clip_file_by_geometries(
            "./files/merge_polygons_2023-06-01.geojson",
            polygon_union,
            "./files/clip_2023-06-01.geojson",
        )


if __name__ == "__main__":
    clip()

from shapely import Polygon, wkt
from shapely.geometry import mapping
from infrastructure.dto.geo_json_dto import GeoJsonDto
import geopandas as gpd


class GeoManager:
    def __init__(self):
        pass

    def polygon_from_wkt(self, geom_wkt) -> Polygon | None:
        if geom_wkt:
            return wkt.loads(geom_wkt)
        return None

    def create_geojson(self, region_dto: GeoJsonDto):
        dt = gpd.GeoDataFrame(
            {
                "name": [region_dto.name],
                "kato": [region_dto.kato],
                "x": [region_dto.polygon.centroid.x],
                "y": [region_dto.polygon.centroid.y],
            },
            geometry=[region_dto.polygon],
            crs="EPSG:4326",
        )
        return dt.to_geo_dict()


geo_manager = GeoManager()

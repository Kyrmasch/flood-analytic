from shapely import Polygon, wkt
from shapely.geometry import mapping
from infrastructure.dto.geo_json_dto import GeoJsonDto


class GeoManager:
    def __init__(self):
        pass

    def polygon_from_wkt(self, geom_wkt) -> Polygon | None:
        if geom_wkt:
            return wkt.loads(geom_wkt)
        return None

    def create_geojson(self, region_dto: GeoJsonDto):
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": str(region_dto.id),
                    "type": "Feature",
                    "properties": {
                        "name": region_dto.name,
                        "kato": region_dto.kato,
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [list(region_dto.coordinates.exterior.coords)],
                    },
                }
            ],
        }

    def create_geojson_by_geometry(self, region_dto: GeoJsonDto, geometry):
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": str(region_dto.id),
                    "type": "Feature",
                    "properties": {
                        "name": region_dto.name,
                        "kato": region_dto.kato,
                    },
                    "geometry": mapping(geometry),
                }
            ],
        }


geo_manager = GeoManager()

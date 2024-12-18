from sqlalchemy.orm import Session

from usecases.map.get_static_image import get_static_image, save_region_geojson
from infrastructure.auth import auth_manager


class MapService:
    def __init__(self, db: Session):
        self.db = db

    async def get_image_static(
        self, longitude: float, latitude: float, zoom: float, width: int, height: int
    ):
        return get_static_image(longitude, latitude, zoom, width, height)

    async def save_region_geojson(
        self,
        region: str,
    ):
        return save_region_geojson(region)

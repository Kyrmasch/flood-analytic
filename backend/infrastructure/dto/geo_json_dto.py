from typing import List

from shapely import Polygon


class GeoJsonDto:
    def __init__(
        self,
        region_id: int,
        name: str,
        kato: int,
        polygon: Polygon,
        centroid,
    ):
        self.id = region_id
        self.name = name
        self.kato = kato
        self.polygon = polygon
        self.centroid = centroid

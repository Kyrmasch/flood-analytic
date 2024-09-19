from typing import List


class GeoJsonDto:
    def __init__(
        self,
        region_id: int,
        name: str,
        kato: int,
        coordinates: List,
        centroid,
    ):
        self.id = region_id
        self.name = name
        self.kato = kato
        self.coordinates = coordinates
        self.centroid = centroid

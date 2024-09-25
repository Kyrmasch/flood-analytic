from typing import List
import ee
import geopandas as gpd
import json
from concurrent.futures import ProcessPoolExecutor, as_completed
import os


class EeManager:
    def __init__(self):
        self.service_account = "flood-413@translate-395304.iam.gserviceaccount.com"
        self.credentials = ee.ServiceAccountCredentials(
            self.service_account,
            "/root/flood/flood-analitic/terra-agronomic-652628374bcb.json",
        )
        self.dataset = "JRC/GSW1_4/GlobalSurfaceWater"

        current_dir = os.getcwd()
        self.base_dir = os.path.join(current_dir, "files/tiles")

    def create_grid(self, region, scale):
        bounds = region.bounds().coordinates().get(0).getInfo()

        lon_min = bounds[0][0]
        lat_min = bounds[0][1]
        lon_max = bounds[2][0]
        lat_max = bounds[2][1]

        grid = []
        lat_steps = int((lat_max - lat_min) * 111000 // scale)
        lon_steps = int((lon_max - lon_min) * 111000 // scale)

        for i in range(lon_steps):
            for j in range(lat_steps):
                lon1 = lon_min + (i * scale) / 111000
                lon2 = lon_min + ((i + 1) * scale) / 111000
                lat1 = lat_min + (j * scale) / 111000
                lat2 = lat_min + ((j + 1) * scale) / 111000
                grid.append(
                    ee.Geometry.Polygon(
                        [
                            [
                                [lon1, lat1],
                                [lon2, lat1],
                                [lon2, lat2],
                                [lon1, lat2],
                                [lon1, lat1],
                            ]
                        ]
                    )
                )
        print(f"Всего tiles: {len(grid)}")
        return ee.FeatureCollection(grid)

    def is_water_sectors(self, sector, water_mask):
        clipped_water = water_mask.clip(sector)
        water_stats = clipped_water.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=sector,
            scale=30,
            maxPixels=1e9,
        )

        mean_water = water_stats.get("occurrence").getInfo()
        if mean_water is not None and mean_water > 0:
            return True
        return False

    def process_sector(self, i, sector, water_mask, folder=None):
        is_water = self.is_water_sectors(sector, water_mask)
        if is_water:
            water_polygons = water_mask.clip(sector).reduceToVectors(
                geometryType="polygon",
                reducer=ee.Reducer.countEvery(),
                scale=30,
                geometry=sector,
                maxPixels=1e9,
            )

            if water_polygons.size().getInfo() > 0:
                water_geojson = water_polygons.getInfo()
                with open(
                    f"{self.base_dir}/{folder}/tile_{i}.geojson",
                    "w",
                ) as f:
                    json.dump(water_geojson, f)
                    print(f"Выполнен: {i}")

    def get_tiles(self, geometries: List, folder, area: int = 20000):
        ee.Initialize(self.credentials)

        gdf = gpd.GeoDataFrame(geometry=geometries)
        polygon = gdf.union_all()

        union = gpd.GeoDataFrame([1], geometry=[polygon], crs="EPSG:4326")
        geojson = union.geometry[0].__geo_interface__

        ee_polygon = ee.Geometry(geojson)
        gsw = ee.Image("JRC/GSW1_4/GlobalSurfaceWater")
        water_mask = gsw.select("occurrence").gte(50)
        grid = self.create_grid(ee_polygon, area)
        grid_list = grid.toList(grid.size())

        with ProcessPoolExecutor() as executor:
            futures = []
            for i in range(grid_list.size().getInfo()):
                sector = ee.Feature(grid_list.get(i)).geometry()
                futures.append(
                    executor.submit(
                        self.process_sector,
                        i,
                        sector,
                        water_mask,
                        folder,
                    )
                )

            for future in as_completed(futures):
                future.result()


ee_manager = EeManager()

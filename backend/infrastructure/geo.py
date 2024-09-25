from shapely import Polygon, wkt
from infrastructure.dto.geo_json_dto import GeoJsonDto
import geopandas as gpd
import os
from shapely.geometry import MultiPolygon
from concurrent.futures import ProcessPoolExecutor, as_completed
import pandas as pd


class GeoManager:
    def __init__(self):
        self.utm_epsg = 32642

    def polygon_from_wkt(self, geom_wkt) -> Polygon | None:
        if geom_wkt:
            return wkt.loads(geom_wkt)
        return None

    def create_geojson(
        self,
        region_dto: GeoJsonDto,
    ):
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

    def fix_geometry(self, geom):
        try:
            return geom.buffer(0)
        except Exception as e:
            return None

    def filter_file(
        self,
        input_folder,
        filename,
        output_folder,
        simplify_tolerance=0.5,
    ) -> str:
        try:
            path = os.path.join(input_folder, filename)
            print(path)
            gdf = gpd.read_file(path)
            gdf_projected = gdf.to_crs(epsg=self.utm_epsg)
            gdf_filtered = gdf_projected[gdf_projected.geometry.area >= 20000]

            if not gdf_filtered.empty:
                gdf_union = gdf_filtered.union_all()
                gdf_union_filled = gdf_union.buffer(0)

                if isinstance(gdf_union_filled, MultiPolygon):
                    gdf_union_filled = gdf_union_filled.buffer(0)

                gdf_union_simplified = gdf_union_filled.simplify(
                    tolerance=simplify_tolerance, preserve_topology=True
                )

                gdf_simplified = gpd.GeoDataFrame(
                    geometry=[gdf_union_simplified], crs=gdf_projected.crs
                )

                gdf_simplified = gdf_simplified.to_crs(gdf.crs)

                output_path = os.path.join(output_folder, filename)
                gdf_simplified.to_file(output_path, driver="GeoJSON")
                return output_path
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            return None

    def filter_files(
        self,
        input_folder,
        output_folder,
        simplify_tolerance=0.5,
    ):
        files = [f for f in os.listdir(input_folder) if f.endswith(".geojson")]
        with ProcessPoolExecutor() as executor:
            futures = []
            for file in files:
                futures.append(
                    executor.submit(
                        self.filter_file,
                        input_folder,
                        file,
                        output_folder,
                        simplify_tolerance,
                    )
                )

            for future in as_completed(futures):
                future.result()

    def merge_files(
        self,
        input_folder: str,
        output_file: str,
    ):
        all_gdfs = []

        files = [f for f in os.listdir(input_folder) if f.endswith(".geojson")]
        for file in files:
            path = os.path.join(input_folder, file)
            gdf = gpd.read_file(path)
            all_gdfs.append(gdf)

        if all_gdfs:
            combined_gdf = gpd.GeoDataFrame(
                pd.concat(all_gdfs, ignore_index=True), crs=all_gdfs[0].crs
            )
            if combined_gdf is not None:
                combined_gdf.to_file(output_file, driver="GeoJSON")
                return output_file
            else:
                return None

    def merge_polygons_in_file(
        self,
        input: str,
        output: str,
    ):
        gdf = gpd.read_file(input)
        gdf["geometry"] = gdf["geometry"].apply(self.fix_geometry)
        gdf = gdf[gdf["geometry"].notnull()]
        merged_polygons = gdf.geometry.union_all()
        merged_gdf = gpd.GeoDataFrame(geometry=[merged_polygons], crs=gdf.crs)
        merged_gdf.to_file(output, driver="GeoJSON")
        return output

    def clip_file_by_geometries(
        self,
        input: str,
        polygon,
        output: str,
    ):
        merged_gdf = gpd.read_file(input)
        boundary_gdf = gpd.GeoDataFrame(geometry=[polygon], crs="EPSG:4326")
        if merged_gdf.crs != boundary_gdf.crs:
            boundary_gdf = boundary_gdf.to_crs(merged_gdf.crs)

        clipped_gdf = gpd.clip(merged_gdf, boundary_gdf)
        clipped_gdf.to_file(output, driver="GeoJSON")
        return output


geo_manager = GeoManager()

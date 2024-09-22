import geopandas as gpd
from shapely.ops import unary_union

input_file = "/root/flood/flood-analitic/experiments/files_3/combined_polygons.geojson"
output_file = "/root/flood/flood-analitic/experiments/files_3/merged_polygons.geojson"

gdf = gpd.read_file(input_file)


def fix_geometry(geom):
    try:
        return geom.buffer(0)  # Исправляем возможные топологические ошибки
    except Exception as e:
        print(f"Ошибка исправления геометрии: {e}")
        return None


gdf["geometry"] = gdf["geometry"].apply(fix_geometry)
gdf = gdf[gdf["geometry"].notnull()]
merged_polygons = gdf.geometry.union_all()
merged_gdf = gpd.GeoDataFrame(geometry=[merged_polygons], crs=gdf.crs)
merged_gdf.to_file(output_file, driver="GeoJSON")

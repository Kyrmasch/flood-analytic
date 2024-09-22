import os
import geopandas as gpd
from shapely.geometry import MultiPolygon
from concurrent.futures import ProcessPoolExecutor


input_folder = "/root/flood/flood-analitic/experiments/files"
output_folder = "/root/flood/flood-analitic/experiments/files_2"

utm_epsg = 32642
simplify_tolerance = 0.5  # Чем больше значение, тем сильнее упрощение


def process_file(filename):
    try:
        path = os.path.join(input_folder, filename)
        gdf = gpd.read_file(path)
        gdf_projected = gdf.to_crs(epsg=utm_epsg)
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
            print(f"Файл сохранён по пути: {output_path}")
        else:
            print(f"Нет полигонов с площадью >= 10 кв. метров в файле: {filename}")
    except Exception as e:
        print(f"Ошибка при обработке файла {filename}: {e}")


def process_all_files():
    files = [f for f in os.listdir(input_folder) if f.endswith(".geojson")]
    with ProcessPoolExecutor() as executor:
        executor.map(process_file, files)


if __name__ == "__main__":
    process_all_files()

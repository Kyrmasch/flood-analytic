import os
import geopandas as gpd
import pandas as pd

input_folder = "/root/flood/flood-analitic/experiments/files_2"
output_file = "/root/flood/flood-analitic/experiments/files_3/combined_polygons.geojson"


def load_all_files(input_folder):
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
        return combined_gdf
    else:
        return None


def process_and_save():
    combined_gdf = load_all_files(input_folder)

    if combined_gdf is not None:
        combined_gdf.to_file(output_file, driver="GeoJSON")
        print(f"Все полигоны объединены и сохранены по пути: {output_file}")
    else:
        print("Нет файлов для обработки в папке.")


if __name__ == "__main__":
    process_and_save()

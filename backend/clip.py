import geopandas as gpd
from infrastructure.database import SessionLocal
from infrastructure.geo import GeoManager
from models.region import Region
from models.district import District

merged_file = "/root/flood/flood-analitic/experiments/files_3/merged_polygons.geojson"
output_file = "/root/flood/flood-analitic/experiments/files_3/clipped_polygons.geojson"

# Чтение объединённого файла с полигонами
merged_gdf = gpd.read_file(merged_file)

# Инициализация объектов для работы с базой данных и геометрией
geo = GeoManager()
db = SessionLocal()

# Получаем первый район
district = db.query(District).first()
if district is not None:
    # Получаем все регионы в рамках района
    regions = db.query(Region).filter_by(district_id=district.id).all()

    geometries = []

    for region in regions:
        # Извлечение геометрии региона в формате WKT
        geom_wkt = db.scalar(region.geom.ST_AsText())
        polygon = geo.polygon_from_wkt(geom_wkt)

        try:
            # Попытка исправления топологических ошибок в геометрии
            fixed_polygon = polygon.buffer(0)
            geometries.append(fixed_polygon)
        except:
            print(f"Топологическая ошибка в геометрии региона {region.id}, пропуск...")
            continue

    # Создаём GeoDataFrame с границами всех регионов
    gdf = gpd.GeoDataFrame(geometry=geometries, crs="EPSG:4326")

    # Объединяем все полигоны регионов в один
    polygon_union = gdf.unary_union

    # Превращаем результат в GeoDataFrame для работы с GeoPandas
    boundary_gdf = gpd.GeoDataFrame(geometry=[polygon_union], crs="EPSG:4326")

    # Проверяем, совпадают ли CRS (системы координат) и преобразуем, если нужно
    if merged_gdf.crs != boundary_gdf.crs:
        boundary_gdf = boundary_gdf.to_crs(merged_gdf.crs)

    # Обрезаем полигоны merged_gdf по границам boundary_gdf
    clipped_gdf = gpd.clip(merged_gdf, boundary_gdf)

    # Сохраняем результат
    clipped_gdf.to_file(output_file, driver="GeoJSON")
    print(f"Обрезанные полигоны сохранены по пути: {output_file}")

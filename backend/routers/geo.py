from typing import Optional
from fastapi import APIRouter, Depends, Query
from deps import get_db
from infrastructure.dto.geo_json_dto import GeoJsonDto
from models.region import Region
from models.district import District
from infrastructure.geo import GeoManager, geo_manager
from sqlalchemy.orm import Session
import geopandas as gpd
from shapely.errors import TopologicalError
from shapely.geometry import mapping

geo_router = APIRouter()


@geo_router.get("/district")
async def get_geo_district(
    id: Optional[int] = Query(None, description="ID Области"),
    geo: GeoManager = Depends(lambda: geo_manager),
    db: Session = Depends(get_db),
):
    district = db.query(District).get(id)
    if district is not None:
        regions = db.query(Region).filter_by(district_id=district.id).all()

        geometries = []

        for region in regions:
            geom_wkt = db.scalar(region.geom.ST_AsText())
            polygon = geo.polygon_from_wkt(geom_wkt)

            try:
                fixed_polygon = polygon.buffer(0)
                geometries.append(fixed_polygon)
            except TopologicalError:
                print(
                    f"Топологическая ошибка в геометрии региона {region.id}, пропуск..."
                )
                continue

        gdf = gpd.GeoDataFrame(geometry=geometries)
        polygon = gdf.union_all()

        return geo.create_geojson(
            GeoJsonDto(
                id,
                district.name,
                0,
                polygon,
                polygon.centroid,
            ),
        )

    return {}


@geo_router.get("/region")
async def get_geo_region(
    id: Optional[int] = Query(None, description="ID региона"),
    geo: GeoManager = Depends(lambda: geo_manager),
    db: Session = Depends(get_db),
):
    region = db.query(Region).get(id)
    if region is not None:
        geom_wkt = db.scalar(region.geom.ST_AsText())
        polygon = geo.polygon_from_wkt(geom_wkt)
        return geo.create_geojson(
            GeoJsonDto(
                id,
                region.name_ru,
                region.kato,
                polygon,
                polygon.centroid,
            )
        )

    return {}

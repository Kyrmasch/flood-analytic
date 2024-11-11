from typing import Optional
from fastapi import APIRouter, Depends, Query
from shapely import Point
from deps import get_db
from infrastructure.dto.geo_json_dto import GeoJsonDto
from models.meteorological_station import MeteorologicalStation
from models.region import Region
from models.district import District
from infrastructure.geo import GeoManager, geo_manager
from sqlalchemy.orm import Session
import geopandas as gpd
from shapely.errors import TopologicalError
import asyncio

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

        return await asyncio.create_task(
            geo.create_geojson(
                GeoJsonDto(
                    id,
                    district.name,
                    0,
                    polygon,
                    polygon.centroid,
                )
            )
        )

    return {}


@geo_router.get("/regions")
async def get_geo_regions(
    id: Optional[int] = Query(None, description="ID Области"),
    geo: GeoManager = Depends(lambda: geo_manager),
    db: Session = Depends(get_db),
):
    regions = db.query(Region).filter(Region.district_id == id).all()
    items = []
    for region in regions:
        geom_wkt = db.scalar(region.geom.ST_AsText())
        polygon = geo.polygon_from_wkt(geom_wkt)
        items.append(
            await asyncio.create_task(
                geo.create_geojson(
                    GeoJsonDto(
                        id,
                        region.name_ru,
                        region.kato,
                        polygon,
                        polygon.centroid,
                    )
                )
            )
        )

    return items


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
        return await asyncio.create_task(
            geo.create_geojson(
                GeoJsonDto(
                    id,
                    region.name_ru,
                    region.kato,
                    polygon,
                    polygon.centroid,
                )
            )
        )

    return {}


@geo_router.get("/meteo_stantions")
async def get_geo_meteostantions(
    geo: GeoManager = Depends(lambda: geo_manager),
    db: Session = Depends(get_db),
):
    stantions = db.query(MeteorologicalStation).all()
    data = {
        "object_id": [],
        "name": [],
        "address": [],
        "temperature": [],
        "elevation": [],
        "code": [],
        "geometry": [],
    }

    for row in stantions:
        data["object_id"].append(row.object_id)
        data["name"].append(row.name)
        data["address"].append(row.address)
        data["temperature"].append(row.temperature)
        data["elevation"].append(row.elevation)
        data["code"].append(row.code)
        point = Point(row.longitude, row.latitude)
        data["geometry"].append(point)

    gdf = gpd.GeoDataFrame(data, crs="EPSG:4326")

    return gdf.to_geo_dict()

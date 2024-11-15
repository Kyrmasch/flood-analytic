from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from shapely import Point
from deps import get_db
from infrastructure.dto.geo_json_dto import GeoJsonDto
from models.catalog import Catalog
from models.datavalue import DataValue
from models.region import Region
from models.district import District
from infrastructure.geo import GeoManager, geo_manager
from sqlalchemy.orm import Session
import geopandas as gpd
from shapely.errors import TopologicalError
import asyncio

from models.site import Site

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
    sites = db.query(Site).filter(Site.site_type_id == 1).all()
    data = {
        "object_id": [],
        "name": [],
        "address": [],
        "temperature": [],
        "elevation": [],
        "code": [],
        "geometry": [],
    }

    for site in sites:
        temperature = 0
        elevation = 0
        catalogs: List[Catalog] = site.catalogs

        for catalog in catalogs:
            if catalog.variable_id == 2:
                values: List[DataValue] = catalog.data_values
                if len(values):
                    temperature = values[0].value

            if catalog.variable_id == 3:
                values: List[DataValue] = catalog.data_values
                if len(values):
                    elevation = values[0].value

        data["object_id"].append(site.id)
        data["name"].append(site.name)
        data["address"].append(site.description)
        data["temperature"].append(temperature)
        data["elevation"].append(elevation)
        data["code"].append(site.code)

        point = Point(site.lon, site.lat)
        data["geometry"].append(point)

    gdf = gpd.GeoDataFrame(data, crs="EPSG:4326")

    return gdf.to_geo_dict()

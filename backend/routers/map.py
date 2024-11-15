from fastapi import APIRouter, Query, Depends
from deps import get_map_service
from services.map_service import MapService
import asyncio

map_router = APIRouter()

@map_router.get("/mapbox/image/static", response_model=None)
async def get_mapbox_image(
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location"),
    zoom: int = Query(12, ge=1, le=20, description="Zoom level (1-20)"),
    width: int = Query(800, ge=1, le=1280, description="Width of the image in pixels (max 1280)"),
    height: int = Query(800, ge=1, le=1280, description="Height of the image in pixels (max 1280)"),
    map_service: MapService = Depends(get_map_service),
):
    """
    Получить статичный снимок со спутника
    """

    
    streamingResponse = await asyncio.create_task(
        map_service.get_image_static(latitude=latitude, longitude=longitude, 
                                    zoom=zoom,width=width,height=height)
    )

    return streamingResponse
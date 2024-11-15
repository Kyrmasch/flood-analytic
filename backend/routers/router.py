from fastapi import APIRouter
from routers.calc import calc_router
from routers.auth import auth_router
from routers.geo import geo_router
from routers.meta import meta_router
from routers.data import data_router
from routers.map import map_router

router = APIRouter()


router.include_router(calc_router, prefix="/calc")
router.include_router(auth_router, prefix="/auth")
router.include_router(geo_router, prefix="/geo")
router.include_router(meta_router, prefix="/meta")
router.include_router(data_router, prefix="/data")
router.include_router(map_router, prefix="/map")

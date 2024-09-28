from fastapi import APIRouter
from routers.calc import calc_router
from routers.auth import auth_router
from routers.geo import geo_router
from routers.meta import meta_router

router = APIRouter()


router.include_router(calc_router, prefix="/calc")
router.include_router(auth_router, prefix="/auth")
router.include_router(geo_router, prefix="/geo")
router.include_router(meta_router, prefix="/meta")

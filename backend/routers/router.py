from fastapi import APIRouter
from routers.calc import calc_router
from routers.auth import auth_router

router = APIRouter()


router.include_router(calc_router, prefix="/calc")
router.include_router(auth_router, prefix="/auth")

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from dask.distributed import Client

from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from routers.ws import websocket_router
from routers.calc import calc_router

app = FastAPI()
client = Client("tcp://localhost:8786")

dist_directory = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "frontend", "dist"
)

if not os.path.exists(dist_directory):
    raise RuntimeError(f"Directory '{dist_directory}' does not exist")

assets_directory = os.path.join(dist_directory, "assets")
if not os.path.exists(assets_directory):
    raise RuntimeError(f"Directory '{assets_directory}' does not exist")

app.mount("/assets", StaticFiles(directory=assets_directory), name="assets")
app.mount("/static", StaticFiles(directory=dist_directory), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router, prefix="/ws")
app.include_router(calc_router, prefix="/api")


@app.get("/{full_path:path}")
async def catch_all(full_path: str, request: Request):
    requested_file = os.path.join(dist_directory, full_path)
    if os.path.exists(requested_file) and os.path.isfile(requested_file):
        return FileResponse(requested_file)

    return FileResponse(os.path.join(dist_directory, "index.html"))

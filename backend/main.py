from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware import Middleware
from fastapi.responses import FileResponse, RedirectResponse

from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from admin.app import admin_init
from routers.ws import websocket_router
from routers.router import router

app = FastAPI()

dist_directory = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "frontend",
)

if not os.path.exists(dist_directory):
    raise RuntimeError(f"Directory '{dist_directory}' does not exist")

assets_directory = os.path.join(dist_directory, "src/assets")
if not os.path.exists(assets_directory):
    raise RuntimeError(f"Directory '{assets_directory}' does not exist")

fonts_directory = os.path.join(dist_directory, "public/fonts")
if not os.path.exists(fonts_directory):
    raise RuntimeError(f"Directory '{fonts_directory}' does not exist")

app.mount("/fonts", StaticFiles(directory=fonts_directory), name="fonts")
app.mount("/assets", StaticFiles(directory=assets_directory), name="assets")
app.mount("/static", StaticFiles(directory=dist_directory), name="static")

admin_init(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router, prefix="/ws")
app.include_router(router, prefix="/api")


@app.get("/{full_path:path}")
async def catch_all(full_path: str, request: Request):
    requested_file = os.path.join(dist_directory, full_path)
    if os.path.exists(requested_file) and os.path.isfile(requested_file):
        return FileResponse(requested_file)

    return FileResponse(os.path.join(dist_directory, "index.html"))

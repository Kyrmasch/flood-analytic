from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from dask.distributed import Client
import dask.array as da
import cupy as cp
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/calc")
async def gpu_calculate():
    try:
        x = da.from_array(cp.random.rand(100, 100), chunks=(100, 100))
        result = (x @ x.T).sum(axis=0).compute()
        result_cpu = cp.asnumpy(result)

        cp.get_default_memory_pool().free_all_blocks()

        return {"result": result_cpu.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/{full_path:path}")
async def catch_all(full_path: str, request: Request):
    requested_file = os.path.join(dist_directory, full_path)
    if os.path.exists(requested_file) and os.path.isfile(requested_file):
        return FileResponse(requested_file)

    return FileResponse(os.path.join(dist_directory, "index.html"))

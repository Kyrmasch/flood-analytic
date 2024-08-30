from fastapi import FastAPI, HTTPException
from dask.distributed import Client
import dask.array as da
import cupy as cp

app = FastAPI()
client = Client("tcp://localhost:8786")


@app.get("/gpu-calculate")
async def gpu_calculate():
    try:
        x = da.from_array(cp.random.rand(10000, 10000), chunks=(1000, 1000))
        result = (x @ x.T).sum(axis=0).compute()
        result_cpu = cp.asnumpy(result)
        return {"result": result_cpu.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

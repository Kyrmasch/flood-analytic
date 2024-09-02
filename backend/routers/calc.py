from fastapi import APIRouter, Depends
from fastapi import FastAPI, HTTPException, Request
from infrastructure.websocket import websocket_manager, WebSocketManager
import dask.array as da
import cupy as cp

another_router = APIRouter()


@another_router.get("/calc")
async def gpu_calculate():
    try:
        x = da.from_array(cp.random.rand(100, 100), chunks=(100, 100))
        result = (x @ x.T).sum(axis=0).compute()
        result_cpu = cp.asnumpy(result)

        cp.get_default_memory_pool().free_all_blocks()

        return {"result": result_cpu.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@another_router.get("/send/{client_id}")
async def send_message(
    client_id: str,
    manager: WebSocketManager = Depends(lambda: websocket_manager),
):
    await manager.send_message_to_client(client_id, "200")
    return {"status": "Message sent"}

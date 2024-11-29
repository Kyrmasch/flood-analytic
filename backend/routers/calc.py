from fastapi import APIRouter, Depends
from fastapi import FastAPI, HTTPException, Request
from deps import get_current_user_with_role_factory
from schemas.auth import User as UserSchema
from infrastructure.websocket import websocket_manager, WebSocketManager
import dask.array as da
# import cupy as cp
from infrastructure.dask import DaskManager, dask_manager

calc_router = APIRouter()


@calc_router.get("/devices")
async def get_devises(dc: DaskManager = Depends(lambda: dask_manager)):
    list = dc._devices()
    return {"devices": list}


# @calc_router.get("/calc")
# async def gpu_calculate(
#     dc: DaskManager = Depends(lambda: dask_manager),
#     current_user: UserSchema = Depends(get_current_user_with_role_factory(["admin"])),
# ):
#     try:
#         if dc.client:
#             x = da.from_array(cp.random.rand(100, 100), chunks=(100, 100))
#             result = (x @ x.T).sum(axis=0).compute()
#             result_cpu = cp.asnumpy(result)

#             cp.get_default_memory_pool().free_all_blocks()

#             return {"result": result_cpu.tolist()}
#     except Exception as e:
#         pass
#     raise HTTPException(status_code=500, detail=str(e))


@calc_router.get("/send/{client_id}")
async def send_message(
    client_id: str,
    manager: WebSocketManager = Depends(lambda: websocket_manager),
):
    await manager.send_message_to_client(client_id, "200")
    return {"status": "Message sent"}

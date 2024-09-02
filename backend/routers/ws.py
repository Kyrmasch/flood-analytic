from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from infrastructure.websocket import websocket_manager, WebSocketManager

websocket_router = APIRouter()


@websocket_router.websocket("/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    manager: WebSocketManager = Depends(lambda: websocket_manager),
):
    await manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message_to_client(client_id, f"Echo from server: {data}")
    except WebSocketDisconnect:
        await manager.disconnect(client_id)

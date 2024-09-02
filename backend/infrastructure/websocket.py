from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict


class WebSocketManager:
    def __init__(self):
        self.clients: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.clients[client_id] = websocket

    async def disconnect(self, client_id: str):
        if client_id in self.clients:
            del self.clients[client_id]

    async def send_message_to_client(self, client_id: str, message: str):
        websocket = self.clients.get(client_id)
        if websocket:
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for websocket in self.clients.values():
            await websocket.send_text(message)


websocket_manager = WebSocketManager()

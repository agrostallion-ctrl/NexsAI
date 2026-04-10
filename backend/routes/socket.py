from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, key: str, websocket: WebSocket):
        await websocket.accept()
        if key not in self.active_connections:
            self.active_connections[key] = []
        self.active_connections[key].append(websocket)

    def disconnect(self, key: str, websocket: WebSocket):
        if key in self.active_connections:
            self.active_connections[key].remove(websocket)
            if not self.active_connections[key]:
                del self.active_connections[key]

    async def send_to_user(self, key: str, message: dict):
        if key in self.active_connections:
            for conn in self.active_connections[key]:
                await conn.send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{key}")
async def websocket_endpoint(websocket: WebSocket, key: str):
    await manager.connect(key, websocket)

    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            sender = msg.get("from")
            receiver = msg.get("to")

            # 🔥 send to receiver
            await manager.send_to_user(receiver, msg)

            # 🔥 send to sender
            await manager.send_to_user(sender, msg)

    except WebSocketDisconnect:
        manager.disconnect(key, websocket)
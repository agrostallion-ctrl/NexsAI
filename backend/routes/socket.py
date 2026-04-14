from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

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
            if websocket in self.active_connections[key]:
                self.active_connections[key].remove(websocket)
            if not self.active_connections[key]:
                del self.active_connections[key]

    async def send_to_user(self, key: str, message: dict):
        if key in self.active_connections:
            dead_connections = []
            for conn in self.active_connections[key]:
                try:
                    await conn.send_json(message)
                except:
                    dead_connections.append(conn)

            for conn in dead_connections:
                self.active_connections[key].remove(conn)


manager = ConnectionManager()


@router.websocket("/ws/{key}")
async def websocket_endpoint(websocket: WebSocket, key: str):
    await manager.connect(key, websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(key, websocket)
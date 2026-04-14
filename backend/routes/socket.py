from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        # key = phone number (string)
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, key: str, websocket: WebSocket):
        key = str(key)

        await websocket.accept()

        if key not in self.active_connections:
            self.active_connections[key] = []

        self.active_connections[key].append(websocket)

        print(f"✅ WS CONNECTED: {key}")
        print("📡 Active:", self.active_connections.keys())

    def disconnect(self, key: str, websocket: WebSocket):
        key = str(key)

        if key in self.active_connections:
            if websocket in self.active_connections[key]:
                self.active_connections[key].remove(websocket)

            if not self.active_connections[key]:
                del self.active_connections[key]

        print(f"❌ WS DISCONNECTED: {key}")
        print("📡 Active:", self.active_connections.keys())

    async def send_to_user(self, key: str, message: dict):
        key = str(key)

        if key not in self.active_connections:
            print(f"⚠️ No active WS for: {key}")
            return

        dead_connections = []

        for conn in self.active_connections[key]:
            try:
                await conn.send_json(message)
                print(f"📤 Sent to {key}: {message}")
            except Exception as e:
                print(f"❌ Send error: {e}")
                dead_connections.append(conn)

        # cleanup dead sockets
        for conn in dead_connections:
            if conn in self.active_connections.get(key, []):
                self.active_connections[key].remove(conn)

        # remove key if empty
        if key in self.active_connections and not self.active_connections[key]:
            del self.active_connections[key]


manager = ConnectionManager()


@router.websocket("/ws/{key}")
async def websocket_endpoint(websocket: WebSocket, key: str):
    key = str(key)

    await manager.connect(key, websocket)

    try:
        while True:
            # keep connection alive
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(key, websocket)

    except Exception as e:
        print("❌ WS ERROR:", e)
        manager.disconnect(key, websocket)
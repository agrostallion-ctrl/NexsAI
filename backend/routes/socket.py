from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import asyncio

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, key: str, websocket: WebSocket):
        key = str(key)

        await websocket.accept()

        self.active_connections.setdefault(key, []).append(websocket)

        print(f"✅ WS CONNECTED: {key}")
        print(f"📡 Active users: {list(self.active_connections.keys())}")

    def disconnect(self, key: str, websocket: WebSocket):
        key = str(key)

        if key in self.active_connections:
            if websocket in self.active_connections[key]:
                self.active_connections[key].remove(websocket)

            if not self.active_connections[key]:
                del self.active_connections[key]

        print(f"❌ WS DISCONNECTED: {key}")
        print(f"📡 Active users: {list(self.active_connections.keys())}")

    async def send_to_user(self, key: str, message: dict):
        key = str(key)

        connections = self.active_connections.get(key)

        if not connections:
            print(f"⚠️ No active WS for: {key}")
            return

        dead = []

        for ws in connections:
            try:
                await ws.send_json(message)
                print(f"📤 Sent to {key}")
            except Exception as e:
                print(f"❌ Send error: {e}")
                dead.append(ws)

        # cleanup dead sockets
        for ws in dead:
            connections.remove(ws)

        if not connections:
            self.active_connections.pop(key, None)


manager = ConnectionManager()


@router.websocket("/ws/{key}")
async def websocket_endpoint(websocket: WebSocket, key: str):
    key = str(key)

    await manager.connect(key, websocket)

    try:
        while True:
            # 🔥 heartbeat ping
            await websocket.send_json({"type": "ping"})
            await asyncio.sleep(25)  # every 25 sec

    except WebSocketDisconnect:
        manager.disconnect(key, websocket)

    except Exception as e:
        print("❌ WS ERROR:", e)
        manager.disconnect(key, websocket)
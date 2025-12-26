from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.system_service import get_system_metrics, get_network_interfaces
import asyncio
import time
import random

router = APIRouter()

@router.get("/stats")
def dashboard_stats():
    sys = get_system_metrics()
    return {
        "global_threats": 842000 + int(time.time() % 10000), 
        "active_attacks": int(sys['recv'] * 5) + random.randint(0, 10),
        "threats_blocked": 762000 + int(time.time() % 500),
        "networks_secured": len(get_network_interfaces()),
        "system_load": sys
    }

@router.get("/network")
def network_scan():
    return get_network_interfaces()

@router.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = {
                "system": get_system_metrics(),
                "packet": {
                    "id": int(time.time() * 1000),
                    "type": random.choice(["TCP", "UDP", "HTTP", "DNS", "SSH"]),
                    "size": random.randint(64, 1500),
                    "source": f"192.168.1.{random.randint(2, 254)}",
                    "flag": random.choice(["SYN", "ACK", "FIN", "PSH"]) if random.random() > 0.5 else None
                }
            }
            await websocket.send_json(data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

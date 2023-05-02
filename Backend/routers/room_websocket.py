from fastapi import (APIRouter, Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect,)
from sqlalchemy.orm import Session

from core import database
from core.websocket import ws, ChatMessageTypes

router = APIRouter(
    tags=["WebSocket"]
)

@router.websocket("/ws/{user_id}/{room_id}")
async def websocket_endpoint(user_id: int, room_id: str, websocket: WebSocket, db: Session = Depends(database.get_db)):
    await ws.connect(websocket=websocket, user_id=user_id, room_id=room_id, db=db)
    try:
        while True:
            data = await websocket.receive_json()
            # print("data: ", data)
            # await ws.broadcast(data, room_id=room_id)
            await ws.message(data=data.get("data"), websocket=websocket, user_id=user_id, room_id=room_id, msg_type=data.get("msg_type"), db=db)
    
    except WebSocketDisconnect:
        print("websocket disconnected")
        await ws.disconnect(websocket=websocket, user_id=user_id, room_id=room_id, db=db)
    
    except Exception as e:
        print(e)
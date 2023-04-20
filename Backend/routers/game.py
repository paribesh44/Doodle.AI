from fastapi import APIRouter, Depends, HTTPException, status
from core import database
from sqlalchemy.orm import Session
from models import room, user


router = APIRouter(
    tags=['Game']
)

@router.get("/game_turn/{room_id}/{user_id}")
def gameTurn(room_id:str, user_id:int, db: Session = Depends(database.get_db)):
    room_info = db.query(room.Room).filter(room.Room.room_id==room_id).first()

    user_info = db.query(user.User).filter(user.User.id==user_id).first()

    players = room_info.players

    index = 2465

    for idx in range(len(players)):
        if players[idx] == user_info.username:
            players.remove(user_info.username)
            index = idx
            break

    turn = room_info.turn[index]

    return {"user_id": user_info.id, "turn": turn}
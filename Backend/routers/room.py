from fastapi import APIRouter, Depends, HTTPException, status
from schemas import room_schema
from models import room, user
from core import database
from sqlalchemy.orm import Session
import numpy as np
from forms import roomForm
from sqlalchemy import and_, or_

router = APIRouter(
    tags=['Room'],
    prefix="/room"
)

@router.get("/getUsername/{userId}")
def getUsername(userId: int, db: Session = Depends(database.get_db)):
    user_info = db.query(user.User).filter(user.User.id == userId).first()

    return user_info.username

@router.post("/create", status_code=status.HTTP_201_CREATED)
def createRoom(form: roomForm.RoomForm = Depends(), db: Session = Depends(database.get_db)):
    players = []

    if form.state == "new":
        players.append(form.creator)

    # set all the score of all the players to 0.
    score = []
    score = np.pad(score, (0, len(players)), 'constant')

    turn = [True]

    new_room = room.Room(
        room_id=form.room_id, creator=form.creator, players=players, score=score, turn=turn
    )
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return {"msg": "success"}

@router.get("/memberInfo/{roomID}")
def memberInfo(roomID: str, db: Session = Depends(database.get_db)):
    room_info = db.query(room.Room).filter(room.Room.room_id == roomID).first()

    users_info = db.query(user.User).filter(or_(
        *[user.User.username == player for player in room_info.players]
    )).all()

    # print(users_info)
    # for
    avatars = [] 
    for i in range(len(users_info)):
        avatars.append(users_info[i].avatar)
    print(avatars)

    a = room_info.__dict__
    del a["_sa_instance_state"]
    a["avatar"] = avatars
    print(a)

    return {"msg": "success", "room_info": room_info, "users_info": users_info}


@router.get("/test")
def test(roomID: str, user_id: int, db: Session = Depends(database.get_db)):
    room_info = db.query(room.Room).filter(room.Room.room_id == roomID)

    user_info = db.query(user.User).filter(user.User.id == user_id).first()

    players = room_info.first().players

    index = 0

    print(players)
    
    for idx in range(len(players)):
        if players[idx] == user_info.username:
            players.remove(user_info.username)
            index = idx
            break
    
    print(players)
    print(index)


    score = room_info.first().score
    score = [20, 30, 40]

    print(score)

    score.pop(index)

    print(score)

    room_info.update({"creator": room_info.first().creator, "players": players, "score": score})
    db.commit()

    return room_info.first()

@router.get("/check_room_id/{roomID}")
def checkRoomId(roomID: str, db: Session = Depends(database.get_db)):
    print(roomID)
    room_info = db.query(room.Room).filter(room.Room.room_id == roomID).first()
    print(room_info)

    room_present = False

    if room_info!=None:
        room_present = True
    else:
        room_present = False

    return room_present

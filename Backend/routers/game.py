from fastapi import APIRouter, Depends, HTTPException, status
from core import database
from sqlalchemy.orm import Session
from models import room, user
import random


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
            index = idx
            break

    turn = room_info.turn[index]

    # get the username of the player whose turn is to draw.
    drawing_turns = room_info.turn
    ind = 15456
    for idx in range(len(drawing_turns)):
        if drawing_turns[idx] == True:
            ind = idx
            break
    turn_username = room_info.players[ind]

    user_turn = db.query(user.User).filter(user.User.username==turn_username).first()


    return {"turn_user_id": user_turn.id, "turn": turn, "turn_username": turn_username}

# This function will make previously True turn to False and the next turn to True.
# This function is called after each player's turn has finised.
@router.get("/updateTurn/{room_id}/{username}")
def updateTurn(room_id:str, username:str, db:Session=Depends(database.get_db)):
    room_info = db.query(room.Room).filter(room.Room.room_id == room_id)

    index = 54654

    turn = room_info.first().turn

    player = room_info.first().players

    for idx in range(len(turn)):
        if turn[idx] == True and player[idx] == username:
            index = idx
            turn[idx] = False
            break
    
    if index+1 < len(turn):
        index += 1
        turn[index] = True

    room_info.update({"turn": turn})
    db.commit()

    return {"msg": "success", "room_info": room_info.first()}

@router.get("/check-turn-finished/{room_id}")
def checkAllUserTurnFinished(room_id:str, db:Session=Depends(database.get_db)):
    room_info = db.query(room.Room).filter(room.Room.room_id == room_id).first()

    status = ""

    finished = True in room_info.turn

    if finished == False:
        status = "finished"
    else:
        status = "not-finished"

    return status

@router.get("/game/give_words")
def giveWord():
    words = ["sun", "laptop", "ladder", "eyeglasses", "grapes", "book", "dumbbell", "wristwatch", "wheel", "shovel", "bread", "table", "cloud", "chair", 
             "headphones", "face", "eye", "snake", "lollipop", "pants", "mushroom", "star", "sword", "fish", "clock", "smiley_face", "apple", "bed", "shorts", 
             "broom", "flower", "cell_phone", "car", "camera", "tree", "square", "moon", "hat", "pizza", "axe", "door", "line", "cup", "triangle", "basketball", 
             "banana", "calculator", "television", "toothbrush", "van", "t-shirt", "alarm_clock", "spoon", "candle", "pencil", "frying_pan", "helmet", "light_bulb", 
             "key", "donut", "circle", "butterfly", "bench", "rifle", "cat", "sock", "ice_cream", "moustache", "suitcase", "hammer", "rainbow", "knife", "cookie", 
             "baseball", "bicycle"]
    
    # randomly select 3 words
    random_words = random.sample(words, 3)

    return random_words
    

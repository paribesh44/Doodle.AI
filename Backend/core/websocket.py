import enum
import json
from typing import Dict, List, Optional, Union
from core import database
from datetime import datetime

from models import user, room

from fastapi import WebSocket, Depends
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import time

# dictinary = {
#     "abc": [{user_id: 2, socket: "socket2"}]
#     "xyz":[{user_id: 1, socket: "socket1"}, {user_id: 3, socket: "socket3"}]
# }
# room_connections = {}

# print(room_connections)

# def fun(room_id_new, user_id, websocket):
#     # check whether the "room_id" already exists or not.
#     if room_id_new in room_connections:
#         print("exist")
#         room_connections[room_id_new].append({"user_id": user_id, "socket": websocket})
#     else:
#         # creating new key as "room_id" key donot exits.
#         print("do not exits")
#         room_connections[room_id_new] = [{"user_id": user_id, "socket": websocket}]
        
# fun("abc", 1, "socket1")
# fun("xyz", 2, "socket2")
# fun("abc", 3, "socket3")
# fun("xyz", 4, "socket4")
# fun("xyz", 5, "socket5")

# print(room_connections)

# room_id="abc"

# # access all the "user_id" of a room
# user_id_of_room = [i["user_id"] for i in room_connections[room_id]]
# print(user_id_of_room)

# # access all the "socket" of a room
# user_socket_of_room = [i["socket"] for i in room_connections[room_id]]
# print(user_socket_of_room)

# print(room_connections)

# # remove a certain "user_id" and "socket" from a room
# removing_room_id = "xyz"
# removing_user_id = 4

# for i in range(len(room_connections[removing_room_id])):
#     if room_connections[removing_room_id][i]["user_id"] == removing_user_id:
#         del room_connections[removing_room_id][i]
#         break

# print(room_connections)

class ChatMessageTypes(enum.Enum):
    USER_JOINED: int = 1
    USER_LEFT: int = 2
    GUESS_MESSAGE: int = 3
    CANVAS_DRAWING: int = 4
    USER_SELF_MESSAGE: int = 5
    START_DRAWING_MESSAGE: int = 6
    ACTIVATE_CANVAS_OF_ALL: int = 7
    CHECK_TURN: int = 8
    FINISH_DRAWING_TURN: int = 9
    
class Message(BaseModel):
    msg_type: int
    data: Optional[Union[str, Dict]]
    user: Optional[int]
    username: Optional[str]
    time: Optional[datetime]


class WebSocketManager:
    def __init__(self):
        self.room_connections: Dict = {}

    # this function adds information of user's id and websocket in its equivalent "room_id" key. 
    async def add_info_to_room_connections_dict(self, websocket: WebSocket, user_id: int, room_id: str):
        # check whether the "room_id" already exists or not.
        if room_id in self.room_connections:
            print("exist")
            self.room_connections[room_id].append({"user_id": user_id, "websocket": websocket})
        else:
            # creating new key as "room_id" key donot exits.
            print("do not exits")
            self.room_connections[room_id] = [{"user_id": user_id, "websocket": websocket}]

    async def connect(self, websocket: WebSocket, user_id: int, room_id: str, db: any):
        await websocket.accept()

        # store room_id, user_id and websocket in dictionary
        await self.add_info_to_room_connections_dict(websocket, user_id, room_id)

        print(self.room_connections)

        user_info = db.query(user.User).filter(user.User.id==user_id).first()

        # create a "MESSAGE" instance which tells that the user has joined the room.
        msg_instance = Message(
            msg_type = ChatMessageTypes.USER_JOINED.value,
            data = "connected",
            user = user_id,
            username = user_info.username,
            time = datetime.utcnow()
        )

        print(msg_instance)

        await self.broadcast(data=msg_instance.dict(exclude_none=True), room_id=room_id)

        # check whether the new user connected in already in room or not.
        # If not joined then keep in the database
        room_info = db.query(room.Room).filter(room.Room.room_id == room_id)

        user_info = db.query(user.User).filter(user.User.id == user_id).first()

        players = room_info.first().players
        players.append(user_info.username)

        score = room_info.first().score
        score.append(0)

        print(room_info.first().turn)

        turn = room_info.first().turn

        if room_info.first().creator != user_info.username:
            turn.append(False)

        if user_info.username not in room_info.first().players:
            room_info.update({"creator": room_info.first().creator, "players": players, "score": score, "turn": turn})
            db.commit()

        users_info = db.query(user.User).filter(or_(
                *[user.User.username == player for player in room_info.first().players]
            )).all()
        
        avatars = [] 
        for i in range(len(users_info)):
            avatars.append(users_info[i].avatar)

        room_info_dict = room_info.first().__dict__
        room_info_dict["avatars"] = avatars

        await self.broadcast(data={"msg_type":5, "data":room_info_dict, "user_id": user_id, "username": user_info.username}, room_id=room_id)
    

        # get whose turn is it to draw.
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

        turn_dict_dict = {"turn_user_id": user_turn.id, "turn": turn, "turn_username": turn_username}

        await self.broadcast(data={"msg_type":8, "data":turn_dict_dict, "user_id": user_id, "username": user_info.username}, room_id=room_id)
    


    async def broadcast(self, data: any, room_id: str):
        encoded_data = jsonable_encoder(data)

        # get all the "websocket" of a certain room "room_id"
        connections = [i["websocket"] for i in self.room_connections[room_id]]

        for connection in connections:
            try:
                await connection.send_json(encoded_data)
            except Exception as e:
                pass
    
    async def message(self, data: str, websocket: WebSocket, user_id: int, room_id: str, msg_type: int, db:any):

        user_info = db.query(user.User).filter(user.User.id==user_id).first()

        if msg_type == ChatMessageTypes.GUESS_MESSAGE.value:
            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username,
                time = datetime.utcnow()
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )

        elif msg_type == ChatMessageTypes.START_DRAWING_MESSAGE.value:
            msg_instance = Message(
                msg_type = msg_type,
                data = data
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )
        elif msg_type == ChatMessageTypes.ACTIVATE_CANVAS_OF_ALL.value:
            msg_instance = Message(
                msg_type = msg_type,
                data = data
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )
        
        # if the msg_type is canvas_drawing then send the data to everyone expect the own.
        elif msg_type == ChatMessageTypes.CANVAS_DRAWING.value:
            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username,
                time = datetime.utcnow()
            )

            # get all the "websocket" of a room "room_id" expect the own's websocket
            connections = [i["websocket"] for i in self.room_connections[room_id] if i != websocket]

            encoded_data = jsonable_encoder(msg_instance)

            for connection in connections:
                print("websocket ", connection)
                try:
                    await connection.send_json(encoded_data)
                except Exception as e:
                    pass
        
        elif msg_type == ChatMessageTypes.FINISH_DRAWING_TURN.value:
            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username,
                time = datetime.utcnow()
            )

            # frontend: {"last_turn_userId", "userId"}

            room_info = db.query(room.Room).filter(room.Room.room_id == room_id)
            user_info = db.query(user.User).filter(user.User.id == data.last_turn_userId).first()

            index = 54654

            turn = room_info.first().turn

            player = room_info.first().players

            for idx in range(len(turn)):
                if turn[idx] == True and player[idx] == user_info.username:
                    index = idx
                    turn[idx] = False
                    break
            
            if index+1 < len(turn):
                index += 1
                turn[index] = True

            room_info.update({"turn": turn})
            db.commit()


            turn = room_info.first().turn

            user_turn = db.query(user.User).filter(user.User.username==player[index]).first()

            print("turn update")
            print(user_turn.id)
            print(index)
            print(turn[index])
            print(player[index])


            turn_dict_dict = {"turn_user_id": user_turn.id, "turn": turn[index], "turn_username": player[index]}

            await self.broadcast(data={"msg_type":8, "data":turn_dict_dict, "user_id": user_id, "username": user_info.username}, room_id=room_id)



    async def disconnect(self, websocket: WebSocket, user_id: int, room_id: str, db: any):
        # delete from the "room_connections" dictionary
        for i in range(len(self.room_connections[room_id])):
            #  and self.room_connections[room_id][i]["websocket"] == websocket
            if self.room_connections[room_id][i]["user_id"] == user_id:
                print(f"User #{user_id} has been disconnected from {room_id}")
                del self.room_connections[room_id][i]
                del self.room_connections[room_id][i]
                break
        if self.room_connections[room_id] == []:
            del self.room_connections[room_id]
        
        user_info = db.query(user.User).filter(user.User.id==user_id).first()
        
        # send message that the user has disconnected from the room
        msg_instance = Message(
            msg_type = ChatMessageTypes.USER_LEFT.value,
            data = "disconnected",
            user = user_id,
            username = user_info.username,
            time = datetime.utcnow()
        )
        
        await self.broadcast(data=msg_instance.dict(exclude_none=True), room_id=room_id)

        # delete from the "ROOM" database about the information of the disconnected user.
        room_info = db.query(room.Room).filter(room.Room.room_id == room_id)

        user_info = db.query(user.User).filter(user.User.id == user_id).first()

        players = room_info.first().players

        index = 2465

        for idx in range(len(players)):
            if players[idx] == user_info.username:
                players.remove(user_info.username)
                index = idx
                break
        
        try:
            score = room_info.first().score
            score.pop(index)
            turn = room_info.first().turn
            turn.pop(index)
        except:
            pass

        room_info.update({"creator": room_info.first().creator, "players": players, "score": score, "turn": turn})
        db.commit()

        users_info = db.query(user.User).filter(or_(
                *[user.User.username == player for player in room_info.first().players]
            )).all()
        
        avatars = [] 
        for i in range(len(users_info)):
            avatars.append(users_info[i].avatar)

        room_info_dict = room_info.first().__dict__
        room_info_dict["avatars"] = avatars

        print(self.room_connections)

        await self.broadcast(data={"msg_type":5, "data":room_info_dict, "user_id": user_id, "username": user_info.username}, room_id=room_id)

        # if there is no one in the room then delete from the database aswell
        if self.room_connections[room_id] == []:
            db.query(room.Room).filter(room.Room.room_id==room_id).delete()
            db.commit()

            
ws = WebSocketManager()



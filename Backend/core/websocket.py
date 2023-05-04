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
import numpy as np
import math
from simplification.cutil import simplify_coords
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.utils import pad_sequences
from keras.metrics import top_k_categorical_accuracy
def top_3_accuracy(x,y): return top_k_categorical_accuracy(x,y, 3)
from sklearn.preprocessing import LabelEncoder
# from keras.preprocessing.sequence import pad_sequences

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

model = tf.keras.models.load_model("model/lstm_90_acc.h5", compile=False)
model.compile(optimizer = 'adam', loss = 'categorical_crossentropy', metrics = ['categorical_accuracy', top_3_accuracy])

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
    SEND_DRAWING_TO_OTHER_USERS: int = 10
    DRAWING_TO_AI: int = 11
    AI_GUESS: int = 12
    CHOOSEN_WORD: int = 13
    DRAWING_TURN_ALL_FINISH: int = 14
    ONE_PERSON_DRAWING_TURN_FINISH: int = 15
    TIMER_RESET: int = 16
    USER_CORRECTLY_GUESS_WORD_GIVE_SCORE: int = 17
    
class Message(BaseModel):
    msg_type: int
    data: Optional[Union[str, Dict]]
    user: Optional[int]
    username: Optional[str]
    time: Optional[datetime]


class WebSocketManager:
    def __init__(self):
        self.room_connections: Dict = {}
        self.choosenGuessWord = ""
        self.AIChoosenWord = ""
        self.AIGuessedWords = []
        self.wordCorrectlyGuessedPlayers = []
        self.totalNoPlayers = 0
        # NOTE NOTE NOTE NOTE once the drawing turn is finished we need to re-initilize this array to [].
        self.mainStroke = []
        self.words_test = ["sun", "laptop", "axe", "bridge", "arm", "sock"]
        self.words = ["sun", "laptop", "ladder", "eyeglasses", "grapes", "book", "dumbbell", "wristwatch", "shovel", "bread", "table", "tennis racquet",
         "cloud", "chair", "headphones", "eye", "airplane", "snake", "lollipop", "pants", "mushroom", "star", "sword", "clock", "hot dog",
         "stop sign", "mountain", "apple", "bed", "broom", "flower", "spider", "cell phone", "car", "camera", "tree", "moon", "radio", "hat", "pizza",
         "axe", "door", "tent", "umbrella", "line", "cup", "triangle", "basketball", "banana", "calculator", "television", "toothbrush", "pillow",
         "scissors", "t-shirt", "tooth", "alarm clock", "paper clip", "spoon", "microphone", "candle", "pencil", "frying pan", "screwdriver", "helmet",
         "bridge", "light bulb", "ceiling fan", "key", "donut", "bird", "circle", "beard", "butterfly", "cat", "sock", "ice cream", "moustache",
         "suitcase", "hammer", "rainbow", "cookie", "lightning", "bicycle", "ant", "arm", "bee", "birthday cake", "bowtie", "bucket", "cactus",
         "church", "crown", "cruise ship", "dolphin", "drums", "envelope", "fire hydrant", "fireplace", "firetruck", "fish", "flashlight",
         "guitar", "leaf", "octopus", "sea turtle", "windmill"]

    def resample(self, x, y, spacing=1.0):
        output = []
        n = len(x)
        px = x[0]
        py = y[0]
        cumlen = 0
        pcumlen = 0
        offset = 0
        for i in range(1, n):
            cx = x[i]
            cy = y[i]
            dx = cx - px
            dy = cy - py
            curlen = math.sqrt(dx*dx + dy*dy)
            cumlen += curlen
            while offset < cumlen:
                t = (offset - pcumlen) / curlen
                invt = 1 - t
                tx = px * invt + cx * t
                ty = py * invt + cy * t
                output.append((tx, ty))
                offset += spacing
            pcumlen = cumlen
            px = cx
            py = cy
        output.append((x[-1], y[-1]))
        return output
    
    def normalize_resample_simplify(self, strokes, epsilon=1.0, resample_spacing=1.0):
        if len(strokes) == 0:
            raise ValueError('empty image')

        # find min and max
        amin = None
        amax = None
        for x, y, _ in strokes:
            cur_min = [np.min(x), np.min(y)]
            cur_max = [np.max(x), np.max(y)]
            amin = cur_min if amin is None else np.min([amin, cur_min], axis=0)
            amax = cur_max if amax is None else np.max([amax, cur_max], axis=0)

        # drop any drawings that are linear along one axis
        arange = np.array(amax) - np.array(amin)
        if np.min(arange) == 0:
            raise ValueError('bad range of values')

        arange = np.max(arange)
        output = []
        for x, y, _ in strokes:
            xy = np.array([x, y], dtype=float).T
            xy -= amin
            xy *= 255.
            xy /= arange
            resampled = self.resample(xy[:, 0], xy[:, 1], resample_spacing)
            simplified = simplify_coords(resampled, epsilon)
            xy = np.around(simplified).astype(np.uint8)
            # output.append(xy.T.tolist())
            output.append(xy.T.tolist())

        return output
    
    def padStroke(self, stroke: any):
        # unwrap the list
        # 'xi'->x-coordinate , 'yi'->the y-coordinate, and 'i'->the stroke index.
        in_strokes = [(xi,yi,i)  
        for i,(x,y) in enumerate(stroke)
        for xi,yi in zip(x,y)]
        # This line stacks the list of tuples into a NumPy array with shape (num_points, 3), where num_points is the total number of points in the drawing.
        c_strokes = np.stack(in_strokes)
        # replace stroke id with 1 for continue, 2 for new
        c_strokes[:,2] = [1]+np.diff(c_strokes[:,2]).tolist()
        c_strokes[:,2] += 1 # since 0 is no stroke

        # pad the strokes with zeros
        padded_stoke_data =  pad_sequences(c_strokes.swapaxes(0, 1), maxlen=96, padding='post').swapaxes(0, 1)

        padded_stoke_data = padded_stoke_data.reshape(-1, 96, 3)

        return padded_stoke_data 

    async def giveScore(self, room_id: str, user_id: int,  data_userId: int, time: int, noPlayers: int, db: any):
        room_info = db.query(room.Room).filter(room.Room.room_id == room_id)
        user_info = db.query(user.User).filter(user.User.id == data_userId).first()

        print(user_info.username)

        if user_info.username not in self.wordCorrectlyGuessedPlayers:
            self.wordCorrectlyGuessedPlayers.append(user_info.username)
        
        print("wordCorrectlyGuessedPlayers: ", self.wordCorrectlyGuessedPlayers)

        # find the index of the player when they predicted the image.
        whenDidUserPredictedWord = self.wordCorrectlyGuessedPlayers.index(user_info.username)

        # finding score based on position of user correctly predicted word and time(how late). Total score: 300
        total_no_of_players = noPlayers
        
        total_marks = 100
        total_time = 30

        players = room_info.first().players
        scores = room_info.first().score

        score = (total_marks - (whenDidUserPredictedWord/total_no_of_players) * total_marks) + (total_marks - ((total_time-time)/total_time) * total_marks)

        # find the index of that player in room's players list and update the corresponding score index with the score scored.
        playerIndex = players.index(user_info.username)

        # update the corresponding score
        scores[playerIndex] = round(score)

        # update in database
        room_info.update({"score": scores})
        db.commit()

        # boardcast to show new score
        users_info = db.query(user.User).filter(or_(
            *[user.User.username == player for player in room_info.first().players]
        )).all()
    
        avatars = [] 
        for i in range(len(users_info)):
            avatars.append(users_info[i].avatar)
            
        avatars = avatars[1:] + [avatars[0]]

        room_info_dict = room_info.first().__dict__
        room_info_dict["avatars"] = avatars

        await self.broadcast(data={"msg_type":5, "data":room_info_dict, "user_id": user_id, "username": user_info.username}, room_id=room_id)

    async def drawingAI(self, websocket: WebSocket, data: str, user_id: int, room_id: str, msg_type: int, db:any):
        # print(data)
        mainStroke = []
        strokeWrapper = []

        strokeWrapper.append(data["strokeX"])
        strokeWrapper.append(data["strokeY"])
        strokeWrapper.append(data["strokeT"])

        self.mainStroke.append(strokeWrapper)

        # print("main Stroke: ", self.mainStroke)

        finalStroke = [self.mainStroke]

        simplified_drawings = []
        for drawing in finalStroke:
            simplified_drawing = self.normalize_resample_simplify(drawing)
            simplified_drawings.append(simplified_drawing)

        # for index, raw_drawing in enumerate(finalStroke, 0):
    
        #     plt.figure(figsize=(6,3))
            
        #     for x,y,t in raw_drawing:
        #         plt.subplot(1,2,1)
        #         plt.plot(x, y, marker='.')
        #         plt.axis('off')

        #     plt.gca().invert_yaxis()
        #     plt.axis('equal')

        #     for x,y in simplified_drawings[index]:
        #         plt.subplot(1,2,2)
        #         plt.plot(x, y, marker='.')
        #         plt.axis('off')

        #     plt.gca().invert_yaxis()
        #     plt.axis('equal')
        #     plt.show()

        print("simplified drawing: ", simplified_drawings)

        paddedSimplifiedStroke = self.padStroke(stroke=simplified_drawings[0])
        # laptop
        # simplified_drawings = [[[10, 0, 1, 12, 44, 187, 203, 207, 203, 206, 203, 65, 43, 26, 2], [127, 224, 248, 245, 245, 255, 255, 251, 242, 200, 135, 125, 125, 130, 123]], [[33, 32, 103, 122, 138, 170, 179, 181, 186, 186, 154, 118, 112, 50, 39, 38], [164, 235, 238, 244, 255, 241, 240, 236, 208, 173, 162, 156, 152, 147, 148, 164]], [[47, 48], [169, 169]], [[91, 92], [170, 171]], [[113, 114], [180, 180]], [[143, 144], [182, 181]], [[151, 152], [181, 181]], [[154, 154], [200, 200]], [[147, 129], [201, 201]], [[115, 111], [201, 201]], [[95, 86], [197, 197]], [[58, 34], [201, 196]], [[28, 28], [195, 197]], [[38, 42], [208, 209]], [[76, 85], [217, 219]], [[92, 98], [219, 221]], [[120, 126], [225, 225]], [[136, 145], [225, 225]], [[147, 150], [224, 224]], [[203, 194, 190, 179, 38, 8, 10], [130, 21, 7, 1, 1, 8, 109]], [[25, 28, 32, 38], [109, 105, 51, 37]]]

        prediction = model.predict(paddedSimplifiedStroke)

        # percentages = [round(val * 100, 2) for val in prediction[0]]
        # print(percentages)
        word_encoder = LabelEncoder()
        word_encoder.fit(self.words)

        top_3_pred = [word_encoder.classes_[np.argsort(-1*c_pred)[:3]] for c_pred in prediction]

        print(top_3_pred[0])

        top_3_idx = np.argsort(-1*prediction)[:3]
        top_3_sum = np.sum(prediction[0][top_3_idx])
        percentage = prediction[0][top_3_idx[0]]/top_3_sum
        percentages = [round(val * 100, 2) for val in percentage]
        print(percentages[:3])

        # if first guess of te AI is not correct then store that in a variable(list) and for another guess is also the same then show another guess and continue so on.
        AIword = top_3_pred[0][0]

        if top_3_pred[0][0] in self.AIGuessedWords:
            AIword = top_3_pred[0][1]
            if AIword in self.AIGuessedWords:
                AIword = top_3_pred[0][2]
                if AIword in self.AIGuessedWords:
                    AIword = top_3_pred[0][0]
                else:
                    self.AIGuessedWords.append(top_3_pred[0][2])
            else:
                self.AIGuessedWords.append(top_3_pred[0][1])
        else:
            self.AIGuessedWords.append(top_3_pred[0][0])

        # print(AIword)

        
        if self.choosenGuessWord != self.AIChoosenWord:
            msg_instance = Message(
                msg_type = ChatMessageTypes.AI_GUESS.value,
                data = AIword
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )
        # if AI predicts the word correctly then store that info to "self.wordCorrectlyGuessedPlayers"
        else:
            user_info = db.query(user.User).filter(user.User.username == "AI").first()
            await self.giveScore(room_id=room_id, user_id=user_info.id, data_userId=user_info.id, time=18, noPlayers=self.totalNoPlayers+1, db=db)

        if self.choosenGuessWord != self.AIChoosenWord:
            self.AIChoosenWord = AIword

        # print("AI guesses: ", self.AIGuessedWords)
        # print("AI chhoosen word: ", self.AIChoosenWord)
        

    # this function adds information of user's id and websocket in its equivalent "room_id" key. 
    async def add_info_to_room_connections_dict(self, websocket: WebSocket, user_id: int, room_id: str):
        # check whether the "room_id" already exists or not.
        print("Room Id: ", room_id)
        print("room_connections: ", self.room_connections)
        print("Room exit or not: ", room_id in self.room_connections)
        if room_id in self.room_connections:
            print("exist")
            self.room_connections[room_id].append({"user_id": user_id, "websocket": websocket})
        else:
            # creating new key as "room_id" key donot exits.
            print("do not exits")
            self.room_connections[room_id] = [{"user_id": user_id, "websocket": websocket}]

    async def connect(self, websocket: WebSocket, user_id: int, room_id: str, db: any):
        await websocket.accept()

        self.totalNoPlayers += 1

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

        # print(msg_instance)

        await self.broadcast(data=msg_instance.dict(exclude_none=True), room_id=room_id)

        # check whether the new user connected in already in room or not.
        # If not joined then keep in the database
        room_info = db.query(room.Room).filter(room.Room.room_id == room_id)

        user_info = db.query(user.User).filter(user.User.id == user_id).first()

        players = room_info.first().players
        score = room_info.first().score
        turn = room_info.first().turn

        # check if "AI" exits in the players list, if no then add AI to the list.
        if "AI" not in players:
            players.append("AI")
            score.append(0)
            turn.append(False)
            players = players[1:]
            score = score[1:]
            room_info.update({"creator": room_info.first().creator, "players": players, "score": score, "turn": turn})
            db.commit()

        # get the index of the AI
        aiIndex = players.index("AI")
        # add the new item in front of the existing item
        players.insert(aiIndex, user_info.username)
        # players.append(user_info.username)

        # score.append(0)
        score.insert(aiIndex, 0)


        if room_info.first().creator != user_info.username:
            # turn.append(False)
            turn.insert(aiIndex, False)

        if user_info.username not in room_info.first().players:
            room_info.update({"creator": room_info.first().creator, "players": players, "score": score, "turn": turn})
            db.commit()

        users_info = db.query(user.User).filter(or_(
                *[user.User.username == player for player in room_info.first().players]
            )).all()
        
        avatars = [] 
        for i in range(len(users_info)):
            avatars.append(users_info[i].avatar)

        avatars = avatars[1:] + [avatars[0]]

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

        data={"msg_type":8, "data":turn_dict_dict, "user_id": user_id, "username": user_info.username}
        encoded_data = jsonable_encoder(data)
        await websocket.send_json(encoded_data)


    async def broadcast(self, data: any, room_id: str):
        encoded_data = jsonable_encoder(data)

        # get all the "websocket" of a certain room "room_id"
        connections = [i["websocket"] for i in self.room_connections[room_id]]

        # print("connections: ", connections)

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
        
        elif msg_type == ChatMessageTypes.CHOOSEN_WORD.value:

            if data != "yes":
                self.choosenGuessWord = data["word"]

            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )

            # connections = [i["websocket"] for i in self.room_connections[room_id] if i != websocket]

            # encoded_data = jsonable_encoder(msg_instance)

            # for connection in connections:
            #     # print("websocket ", connection)
            #     try:
            #         await connection.send_json(encoded_data)
            #     except Exception as e:
            #         pass

        elif msg_type == ChatMessageTypes.START_DRAWING_MESSAGE.value:
            print("yaha pugo ki xina ta")
            msg_instance = Message(
                msg_type = msg_type,
                data = data
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )
        elif msg_type == ChatMessageTypes.DRAWING_TO_AI.value:
            # websocket: WebSocket, data: str, user_id: int, room_id: str, msg_type: int, db:any
            await self.drawingAI(websocket=websocket, data=data, user_id=user_id, room_id=room_id, msg_type=msg_type, db=db)

        elif msg_type == ChatMessageTypes.SEND_DRAWING_TO_OTHER_USERS.value:
            msg_instance = Message(
                msg_type = msg_type,
                data = data
            )

            # get all the "websocket" of a room "room_id" expect the own's websocket
            connections = [i["websocket"] for i in self.room_connections[room_id] if i != websocket]

            encoded_data = jsonable_encoder(msg_instance)

            for connection in connections:
                # print("websocket ", connection)
                try:
                    await connection.send_json(encoded_data)
                except Exception as e:
                    pass

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
                # print("websocket ", connection)
                try:
                    await connection.send_json(encoded_data)
                except Exception as e:
                    pass

        elif msg_type == ChatMessageTypes.ONE_PERSON_DRAWING_TURN_FINISH.value:
            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )

        elif msg_type == ChatMessageTypes.TIMER_RESET.value:
            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )
        
        elif msg_type == ChatMessageTypes.USER_CORRECTLY_GUESS_WORD_GIVE_SCORE.value:
            print("give score: ", data)
            
            await self.giveScore(room_id=room_id, user_id=user_id, data_userId=data["userId"], time=data["time"], noPlayers=data["noPlayers"], db=db)

        
        elif msg_type == ChatMessageTypes.FINISH_DRAWING_TURN.value:
            print("user_id: ", user_id)
            print("Data: ", data)
            print(data["last_turn_userId"])
            # remove all the elements from the list after some user turn has been finished.
            print("Main stroke before: ", self.mainStroke)
            self.mainStroke.clear()
            self.choosenGuessWord = ""
            self.AIChoosenWord = ""
            self.AIGuessedWords = []
            self.wordCorrectlyGuessedPlayers = []
            print("Main stroke after: ", self.mainStroke)

            msg_instance = Message(
                msg_type=msg_type,
                data=data,
                user=user_id,
                username=user_info.username,
                time = datetime.utcnow()
            )

            # frontend: {"last_turn_userId", "userId"}

            room_info = db.query(room.Room).filter(room.Room.room_id == room_id)
            user_info = db.query(user.User).filter(user.User.id == data["last_turn_userId"]).first()

            # if user_info.id == user_id:

            print(user_info.username)

            index = 54654

            turn = room_info.first().turn

            player = room_info.first().players

            
            for idx in range(len(turn)):
                if turn[idx] == True and player[idx] == user_info.username:
                    index = idx
                    turn[idx] = False
                    break

            if index+2 >= len(turn):
                print("sabai ko palo sakeyo")
                # all the turn finished
                msg_instance = Message(
                    msg_type = 14,
                    data = True
                )

                await self.broadcast(
                    msg_instance.dict(exclude_none=True), room_id
                )
                    
            if index+1 < len(turn):
                index += 1
                if player[index] != "AI":
                    turn[index] = True
                else:
                    turn[index] = False
            else:
                print("sabai ko palo sakeyo")
                # all the turn finished
                msg_instance = Message(
                    msg_type = 14,
                    data = True
                )

                await self.broadcast(
                    msg_instance.dict(exclude_none=True), room_id
                )

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
            data={"msg_type":8, "data":turn_dict_dict, "user_id": user_id, "username": user_info.username}

            msg_instance = Message(
                msg_type = 8,
                data = turn_dict_dict,
                user_id = user_id
            )

            await self.broadcast(
                msg_instance.dict(exclude_none=True), room_id
            )


    async def disconnect(self, websocket: WebSocket, user_id: int, room_id: str, db: any):
        # delete from the "room_connections" dictionary
        for i in range(len(self.room_connections[room_id])):
            #  and self.room_connections[room_id][i]["websocket"] == websocket
            if self.room_connections[room_id][i]["user_id"] == user_id:
                print(f"User #{user_id} has been disconnected from {room_id}")
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



from fastapi import APIRouter, Depends, HTTPException, status
from core import database
from sqlalchemy.orm import Session
from models import room, user
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.utils import pad_sequences
import math
from simplification.cutil import simplify_coords
from keras.metrics import top_k_categorical_accuracy
def top_3_accuracy(x,y): return top_k_categorical_accuracy(x,y, 3)
import matplotlib.pyplot as plt


router = APIRouter(
    tags=['Game']
)

model = tf.keras.models.load_model("model/lstm_89_acc.h5", compile=False)
model.compile(optimizer = 'adam', loss = 'categorical_crossentropy', metrics = ['categorical_accuracy', top_3_accuracy])

@router.get("/testDrawig")
def game():
    mainStroke = [[[167, 109, 80, 69, 58, 31, 57, 117, 99, 52, 30, 6, 1, 2, 66, 98, 253, 254, 246, 182, 165], 
                            [140, 194, 227, 232, 229, 229, 206, 124, 123, 149, 157, 159, 153, 110, 82, 77, 74, 109, 121, 127, 120]], 
                            [[207, 207, 210, 221, 238], [74, 103, 114, 128, 135]], [[119, 107, 76, 70, 49, 39, 60, 93], [72, 41, 3, 0, 1, 5, 38, 70]]]
    # after simplification
    # [[[[0, 8, 17, 19, 23, 24, 28, 32, 34, 41, 41, 45, 47, 51, 62, 64, 71], [0, 8, 26, 45, 53, 62, 84, 92, 108, 120, 133, 141, 152, 205, 231, 242, 255]]]]
    print("lets see: ", mainStroke)
    # unwrap the list
    # 'xi'->x-coordinate , 'yi'->the y-coordinate, and 'i'->the stroke index.
    in_strokes = [(xi,yi,i)  
    for i,(x,y) in enumerate(mainStroke) 
    for xi,yi in zip(x,y)]
    print("in stroke: ", in_strokes)
    # This line stacks the list of tuples into a NumPy array with shape (num_points, 3), where num_points is the total number of points in the drawing.
    c_strokes = np.stack(in_strokes)
    # replace stroke id with 1 for continue, 2 for new
    c_strokes[:,2] = [1]+np.diff(c_strokes[:,2]).tolist()
    print("c stroke1: ", c_strokes)
    c_strokes[:,2] += 1 # since 0 is no stroke
    print("c stroke2: ", c_strokes)

    # pad the strokes with zeros
    padded_stoke_data =  pad_sequences(c_strokes.swapaxes(0, 1), maxlen=96, padding='post').swapaxes(0, 1)
    # padded_stoke_data = np.zeros((len(mainStroke), 96))
    # print(len(mainStroke))
    # print(padded_stoke_data)
    # for i, seq in enumerate(mainStroke):
    #     print("i: ", i)
    #     print("seq: ", seq)
    #     padded_seq = np.pad(seq, (0, 96 - len(seq)), 'constant', constant_values=0)
    #     print("padded_seq: ", padded_seq)
    #     padded_stoke_data[i] = padded_seq

    # padded_strokes = torch.nn.utils.rnn.pad_sequence(torch.transpose(torch.tensor(c_strokes), 0, 1), batch_first=True, padding_value=0)

    # print(padded_stoke_data)
    print(padded_stoke_data.shape)

    padded_stoke_data = padded_stoke_data.reshape(-1, 96, 3)
    print(padded_stoke_data.shape)

    prediction = model.predict(padded_stoke_data)
    return {"prediction": 45}

def resample(x, y, spacing=1.0):
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

def normalize_resample_simplify(strokes, epsilon=1.0, resample_spacing=1.0):
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
        resampled = resample(xy[:, 0], xy[:, 1], resample_spacing)
        simplified = simplify_coords(resampled, epsilon)
        xy = np.around(simplified).astype(np.uint8)
        output.append(xy.T.tolist())

    return output

@router.get("/raw-to-simplified")
def test():
    # mainStroke = [[[[516.8399658203125, 521.0499877929688, 523.1599731445312, 525.260009765625, 526.3200073242188, 526.3200073242188, 528.4199829101562, 
    #                  528.4199829101562, 529.469970703125, 530.5299682617188, 532.6300048828125, 533.6799926757812, 536.8399658203125, 536.8399658203125, 
    #                  538.9500122070312, 540, 540, 541.0499877929688, 541.0499877929688, 541.0499877929688, 542.1099853515625, 542.1099853515625, 544.2099609375, 
    #                  545.260009765625, 547.3699951171875, 548.4199829101562, 550.5299682617188, 551.5800170898438], 
    #                  [102.2699966430664, 106.4800033569336, 110.68999481201172, 114.9000015258789, 120.15999603271484, 124.37000274658203, 128.57999420166016, 
    #                   132.79000091552734, 137.01000213623047, 143.31999969482422, 147.52999114990234, 154.9000015258789, 161.2199935913086, 167.52999114990234, 
    #                   171.73999786376953, 177.01000213623047, 182.2699966430664, 186.4800033569336, 190.68999481201172, 194.9000015258789, 199.10999298095703, 
    #                   203.31998443603516, 207.5300064086914, 211.73999786376953, 215.94998931884766, 221.22000885009766, 225.43000030517578, 227.5300064086914], 
    #                   [11019, 11041, 11072, 11112, 11152, 11182, 11192, 11209, 11219, 11233, 11240, 11256, 11272, 11296, 11322, 11336, 11360, 11384, 11416, 11529, 
    #                    11576, 11624, 11651, 11672, 11793, 11831, 11865, 11947]]]]
    mainStroke = [[[[771.5799560546875, 767.3699951171875, 763.1599731445312, 758.9500122070312, 753.6799926757812, 748.4199829101562, 744.2099609375, 741.0499877929688, 738.9500122070312, 736.8399658203125, 735.7899780273438, 735.7899780273438, 735.7899780273438, 735.7899780273438, 735.7899780273438, 735.7899780273438, 742.1099853515625, 747.3699951171875, 752.6300048828125, 762.1099853515625, 766.3200073242188, 771.5799560546875, 776.8399658203125, 783.1599731445312, 788.4199829101562, 791.5799560546875, 794.739990234375, 795.7899780273438, 796.8399658203125, 800, 800, 800, 800, 795.7899780273438, 791.5799560546875, 787.3699951171875, 786.3200073242188], [254.9000015258789, 253.84998321533203, 252.78998565673828, 252.78998565673828, 252.78998565673828, 257.0099868774414, 260.1599807739258, 264.37000274658203, 269.6399917602539, 274.9000015258789, 280.1599807739258, 284.37000274658203, 288.57999420166016, 293.84998321533203, 299.10999298095703, 303.31998443603516, 308.57999420166016, 311.73999786376953, 314.9000015258789, 319.10999298095703, 319.10999298095703, 319.10999298095703, 319.10999298095703, 313.84998321533203, 308.57999420166016, 304.37000274658203, 299.10999298095703, 294.9000015258789, 288.57999420166016, 283.31998443603516, 278.0600051879883, 273.84998321533203, 268.57999420166016, 266.47998809814453, 264.37000274658203, 262.2699966430664, 262.2699966430664], [6422, 6435, 6457, 6520, 6557, 6593, 6615, 6648, 6672, 6707, 6728, 6743, 6770, 6792, 6809, 6816, 6832, 6840, 6848, 6863, 6871, 6906, 6927, 6960, 6983, 7000, 7016, 7056, 7080, 7095, 7112, 7128, 7153, 7205, 7223, 7248, 7263]], [[654.739990234375, 654.739990234375, 654.739990234375, 654.739990234375, 654.739990234375, 655.7899780273438, 661.0499877929688, 665.260009765625, 670.5299682617188, 674.739990234375, 680, 684.2099609375, 688.4199829101562, 693.6799926757812, 697.8900146484375, 702.1099853515625, 706.3200073242188, 710.5299682617188, 710.5299682617188, 710.5299682617188, 710.5299682617188, 710.5299682617188, 710.5299682617188, 710.5299682617188, 706.3200073242188, 702.1099853515625, 696.8399658203125, 692.6300048828125, 688.4199829101562, 683.1599731445312, 678.9500122070312, 674.739990234375, 669.469970703125, 665.260009765625, 661.0499877929688, 655.7899780273438, 652.6300048828125], [269.6399917602539, 273.84998321533203, 278.0600051879883, 282.2699966430664, 286.47998809814453, 290.68997955322266, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 291.73999786376953, 290.68997955322266, 286.47998809814453, 282.2699966430664, 278.0600051879883, 273.84998321533203, 269.6399917602539, 265.4300003051758, 262.2699966430664, 262.2699966430664, 261.22000885009766, 261.22000885009766, 261.22000885009766, 261.22000885009766, 261.22000885009766, 262.2699966430664, 262.2699966430664, 262.2699966430664, 262.2699966430664, 262.2699966430664, 262.2699966430664], [8019, 8164, 8208, 8274, 8321, 8376, 8448, 8496, 8528, 8593, 8648, 8675, 8704, 8736, 8803, 8849, 8910, 9033, 9093, 9110, 9122, 9144, 9168, 9203, 9488, 9536, 9560, 9585, 9624, 9664, 9688, 9744, 9784, 9848, 9916, 9953, 10156]], [[516.8399658203125, 521.0499877929688, 523.1599731445312, 525.260009765625, 526.3200073242188, 526.3200073242188, 528.4199829101562, 528.4199829101562, 529.469970703125, 530.5299682617188, 532.6300048828125, 533.6799926757812, 536.8399658203125, 536.8399658203125, 538.9500122070312, 540, 540, 541.0499877929688, 541.0499877929688, 541.0499877929688, 542.1099853515625, 542.1099853515625, 544.2099609375, 545.260009765625, 547.3699951171875, 548.4199829101562, 550.5299682617188, 551.5800170898438], [102.2699966430664, 106.4800033569336, 110.68999481201172, 114.9000015258789, 120.15999603271484, 124.37000274658203, 128.57999420166016, 132.79000091552734, 137.01000213623047, 143.31999969482422, 147.52999114990234, 154.9000015258789, 161.2199935913086, 167.52999114990234, 171.73999786376953, 177.01000213623047, 182.2699966430664, 186.4800033569336, 190.68999481201172, 194.9000015258789, 199.10999298095703, 203.31998443603516, 207.5300064086914, 211.73999786376953, 215.94998931884766, 221.22000885009766, 225.43000030517578, 227.5300064086914], [11019, 11041, 11072, 11112, 11152, 11182, 11192, 11209, 11219, 11233, 11240, 11256, 11272, 11296, 11322, 11336, 11360, 11384, 11416, 11529, 11576, 11624, 11651, 11672, 11793, 11831, 11865, 11947]]]]
    
    print(len(mainStroke))
    simplified_drawings = []
    for drawing in mainStroke:
        simplified_drawing = normalize_resample_simplify(drawing)
        simplified_drawings.append(simplified_drawing)
    print(simplified_drawings)
    print(len(simplified_drawings))

    for index, raw_drawing in enumerate(mainStroke, 0):
    
        plt.figure(figsize=(6,3))
        
        for x,y,t in raw_drawing:
            plt.subplot(1,2,1)
            plt.plot(x, y, marker='.')
            plt.axis('off')

        plt.gca().invert_yaxis()
        plt.axis('equal')

        for x,y in simplified_drawings[index]:
            plt.subplot(1,2,2)
            plt.plot(x, y, marker='.')
            plt.axis('off')

        plt.gca().invert_yaxis()
        plt.axis('equal')
        plt.show()  

    return "success"

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
    words = ["sun", "laptop", "ladder", "eyeglasses", "grapes", "book", "dumbbell", "wristwatch", "shovel", "bread", "table", "tennis racquet",
         "cloud", "chair", "headphones", "eye", "airplane", "snake", "lollipop", "pants", "mushroom", "star", "sword", "clock", "hot dog",
         "stop sign", "mountain", "apple", "bed", "broom", "flower", "spider", "cell phone", "car", "camera", "tree", "moon", "radio", "hat", "pizza",
         "axe", "door", "tent", "umbrella", "line", "cup", "triangle", "basketball", "banana", "calculator", "television", "toothbrush", "pillow",
         "scissors", "t-shirt", "tooth", "alarm clock", "paper clip", "spoon", "microphone", "candle", "pencil", "frying pan", "screwdriver", "helmet",
         "bridge", "light bulb", "ceiling fan", "key", "donut", "bird", "circle", "beard", "butterfly", "cat", "sock", "ice cream", "moustache",
         "suitcase", "hammer", "rainbow", "cookie", "lightning", "bicycle", "ant", "arm", "bee", "birthday cake", "bowtie", "bucket", "cactus",
         "church", "crown", "cruise ship", "dolphin", "drums", "envelope", "fire hydrant", "fireplace", "firetruck", "fish", "flashlight",
         "guitar", "leaf", "octopus", "sea turtle", "windmill"]
    
    # randomly select 3 words
    random_words = random.sample(words, 3)

    return random_words
    

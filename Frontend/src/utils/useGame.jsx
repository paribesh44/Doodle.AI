import { useState, useEffect, useContext } from "react";
import useSocket from "./useSocket";

const ChatMessageTypes = {
    USER_JOINED: 1,
    USER_LEFT: 2,
    GUESS_MESSAGE: 3,
    CANVAS_DRAWING: 4,
    USER_SELF_MESSAGE: 5,
    START_DRAWING_MESSAGE: 6,
    ACTIVATE_CANVAS_OF_ALL: 7,
    CHECK_TURN: 8,
    FINISH_DRAWING_TURN: 9,
    SEND_DRAWING_TO_OTHER_USERS: 10,
    DRAWING_TO_AI: 11,
    AI_GUESS: 12,
    CHOOSEN_WORD: 13,
    DRAWING_TURN_ALL_FINISH: 14,
    ONE_PERSON_DRAWING_TURN_FINISH: 15,
    TIMER_RESET: 16
  };

const useGame = () => {
    // const [messages, setMessages] = useState([]);
    const [drawing, setDrawing] = useState([]);
    const [userSelfMessage, setUserSelfMessage] = useState([]);
    const [userId, setUserId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [start, setStart] = useState(false);
    const [openCanvas, setOpenCanvas] = useState(false);
    const [test, setTest] = useState(false);
    const [turn, setTurn] = useState(null);
    const [hostDrawing, setHostDrawing] = useState(false);
    const [choosenWord, setChoosenWord] = useState(null);
    const [drawingAllFinish, setDrawingAllFinish] = useState(false);
    const [onePersonDrawingTurnFinish, setOnePersonDrawingTurnFinish] = useState(false);
    const [timesUp, setTimesUp] = useState(false);
    let [timerClock, setTimerClock] = useState(5);
    const [guessCorrect, setGuessCorrect] = useState(false);

  const onMessage = (e) => {
      const data = JSON.parse(e.data);
      // console.log("Data ", data)

      if (data.msg_type == ChatMessageTypes.GUESS_MESSAGE || data.msg_type == ChatMessageTypes.USER_JOINED || data.msg_type == ChatMessageTypes.USER_LEFT) {
        // setMessages([...messages, data]);
        return data
      } else if (data.msg_type == ChatMessageTypes.CANVAS_DRAWING) {
        // console.log("Canvas drawing: ", data)
        // setDrawing([...drawing, data]);
        return data
      } else if (data.msg_type == ChatMessageTypes.USER_SELF_MESSAGE) {
        setUserSelfMessage(data)
      } else if(data.msg_type == ChatMessageTypes.START_DRAWING_MESSAGE) {
        setStart(true);
      } else if(data.msg_type == ChatMessageTypes.ACTIVATE_CANVAS_OF_ALL) {
        setOpenCanvas(true);
      } else if(data.msg_type == ChatMessageTypes.CHECK_TURN) {
        setTurn(data);
      } else if (data.msg_type == ChatMessageTypes.SEND_DRAWING_TO_OTHER_USERS) {
        setHostDrawing(data.data)
      } else if (data.msg_type == ChatMessageTypes.AI_GUESS) {
        return data
      } else if(data.msg_type == ChatMessageTypes.CHOOSEN_WORD) {
        console.log("choosen word: ", data)
        if (data.data == "yes") {
          setChoosenWord(null);
        } else {
          setChoosenWord(data);
        }
      } else if(data.msg_type == ChatMessageTypes.DRAWING_TURN_ALL_FINISH) {
        console.log("sabai finish vayeko ho ta")
        setDrawingAllFinish(true);
      } else if(data.msg_type == ChatMessageTypes.ONE_PERSON_DRAWING_TURN_FINISH) {
        if(data.data == "finish") {
          setOnePersonDrawingTurnFinish(true);
        } else if(data.data == "not-finish") {
          setOnePersonDrawingTurnFinish(false);
        }
      } else if (data.msg_type == ChatMessageTypes.TIMER_RESET) {
        if (data.data == "reset") {
          setTimerClock(5)
          setTimesUp(false)
        }
      }
    };

  const onConnect = (event) => {
    // event.currentTarget.send(JSON.stringify({ msg_type: 1 }));
  };

  const [websocket, history, drawingHistory, setdrawingHistory, setEndpointState] = useSocket({
    onMessage: onMessage,
    onConnect: onConnect,
    fire: (userId != null && roomId != null),
    // endpoint: (userId && roomId)
  });

  useEffect(() => {
    if (userId && roomId) {
      setEndpointState(`ws://localhost:8000/ws/${userId}/${roomId}`);
    }
  });

  const sendMessage = (data) => {
    websocket.send(JSON.stringify(data));
  };

  async function startFun() {
    websocket.send(JSON.stringify({msg_type:6, data:true}))
    setStart(true)
  }

  async function activateCanvas(val) {
    websocket.send(JSON.stringify({msg_type: 13, data:{"word":val, "length":val.length}}))
    websocket.send(JSON.stringify({msg_type: 7, data:true}))
    setOpenCanvas(true)
  }

  async function turnFinished() {
    console.log("what is going on!!")
    websocket.send(JSON.stringify({msg_type: 15, data:"finish"}))
    // setOnePersonDrawingTurnFinish(true)
    setStart(false)
    setOpenCanvas(false)
    // setTimesUp(false)
    // setChoosenWord(null)
  }

  async function startAgain() {
    console.log("start again")
    websocket.send(JSON.stringify({msg_type: 15, data:"not-finish"}))
    websocket.send(JSON.stringify({msg_type: 9, data:{"last_turn_userId":turn.data.turn_user_id, "userId":userId}}))
    // setOnePersonDrawingTurnFinish(false)
    websocket.send(JSON.stringify({msg_type: 13, data:"yes"}))
    websocket.send(JSON.stringify({msg_type:16, data:"reset"}))
    setGuessCorrect(false)
    // setTimerClock(5)
    // setTimesUp(false)
  }

  return [
    sendMessage,
    startFun,
    history,
    drawingHistory,
    setdrawingHistory,
    hostDrawing,
    drawing,
    setDrawing,
    userSelfMessage,
    setUserSelfMessage,
    userId,
    setUserId,
    roomId,
    setRoomId,
    start,
    setStart,
    openCanvas,
    setOpenCanvas,
    activateCanvas,
    test,
    setTest,
    turn,
    setTurn,
    choosenWord,
    drawingAllFinish,
    setDrawingAllFinish,
    turnFinished,
    onePersonDrawingTurnFinish,
    setOnePersonDrawingTurnFinish,
    startAgain,
    timesUp,
    setTimesUp,
    timerClock,
    setTimerClock,
    guessCorrect,
    setGuessCorrect
  ];
};
export default useGame;
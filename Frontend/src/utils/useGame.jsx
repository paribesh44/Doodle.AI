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
    SEND_DRAWING_TO_OTHER_USERS: 10
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

  const onMessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Data ", data)

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
        console.log("Data data k aayo ta", data.data)
        setHostDrawing(data.data)
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

  async function activateCanvas() {
    console.log("yaha pugo ra")
    websocket.send(JSON.stringify({msg_type: 7, data:true}))
    setOpenCanvas(true)
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
    setTurn
  ];
};
export default useGame;
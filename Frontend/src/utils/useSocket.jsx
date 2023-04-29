import { useState, useEffect, useRef } from "react";
import configs from "./configs.jsx";

const ChatMessageTypes = {
    USER_JOINED: 1,
    USER_LEFT: 2,
    GUESS_MESSAGE: 3,
    CANVAS_DRAWING: 4,
    USER_SELF_MESSAGE: 5,
    START_DRAWING_MESSAGE: 6,
    ACTIVATE_CANVAS_OF_ALL: 7,
    CHECK_TURN: 8,
    FINISH_DRAWING_TURN: 9
  };

const useSocket = ({
  endpoint = null,
  onConnect = null,
  fire = true,
  close = false,
  onMessage,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [history, setHistory] = useState([]);
  // const [drawingHistory, setdrawingHistory] = useState([]);
  const [drawingHistory, setdrawingHistory] = useState(null);
  const [closeState, setCloseState] = useState(close);
  const [endpointState, setEndpointState] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (fire && (endpointState || endpoint) != null) {
      ws.current = new WebSocket(
        `${endpointState || endpoint}`
      );
      // ws.current.onmessage = onMessage
      if (!onConnect) {
        ws.current.onopen = () => {
          setIsReady(true);
        };
      } else {
        ws.current.onopen = (data) => {
          setIsReady(true);

          onConnect(data);
        };
      }
    }
  }, [endpointState, endpoint, fire]);

  useEffect(() => {
    if (ws.current != null) {
      ws.current.onmessage = (data) => {
        let ret = onMessage(data);
        if (ret && (ret.msg_type === ChatMessageTypes.GUESS_MESSAGE || ret.msg_type === ChatMessageTypes.USER_JOINED || ret.msg_type === ChatMessageTypes.USER_LEFT)) {
          setHistory([...history, ret]);
        } else if(ret && ret.msg_type == ChatMessageTypes.CANVAS_DRAWING) {
          // setdrawingHistory([...drawingHistory, ret])
          setdrawingHistory(ret)
        }
      };
    }
  }, [fire, endpointState, onMessage, onConnect, isReady]);

  useEffect(() => {
    if (close && ws.current) {
      ws.current.close();
    }
  }, [closeState, setCloseState]);
  return [ws.current, history, drawingHistory, setdrawingHistory, setEndpointState, isReady, setCloseState];
};
export default useSocket;

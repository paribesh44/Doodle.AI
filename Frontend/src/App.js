
import './App.css';
import React, { useMemo }  from 'react';
import Routedpath from './Routes';
import useGame from './utils/useGame';
import { WebSocketContext } from "./utils/contexts/WebSocketContext";

function App() {
  const [
    sendMessage,
    startFun,
    history,
    drawingHistory,
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
  ] = useGame();

  const websocket_context_value = useMemo(
    () => ({
      sendMessage,
      startFun,
      history,
      drawing,
      drawingHistory,
      hostDrawing,
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
    }),
    [
      sendMessage,
      startFun,
      history,
      drawingHistory,
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
    ]
  );

  return (
    <div className='app_color'>
    <WebSocketContext.Provider value={websocket_context_value}>
      <Routedpath></Routedpath>
    </WebSocketContext.Provider>
    </div>
  );
}

export default App;

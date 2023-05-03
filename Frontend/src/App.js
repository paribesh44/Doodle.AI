
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
    setTimesUp
  ] = useGame();

  const websocket_context_value = useMemo(
    () => ({
      sendMessage,
      startFun,
      history,
      drawing,
      drawingHistory,
      setdrawingHistory,
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
      setTurn,
      choosenWord,
      drawingAllFinish,
      setDrawingAllFinish,
      turnFinished,
      onePersonDrawingTurnFinish,
      setOnePersonDrawingTurnFinish,
      startAgain,
      timesUp,
      setTimesUp
    }),
    [
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
      setTimesUp
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

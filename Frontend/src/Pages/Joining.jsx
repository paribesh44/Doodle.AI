import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import StatusBar from "../Components/StatusBar";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import "./Joining.css";
import WaitDraw from "../Components/WaitDraw";
import WaitArea from "../Components/WaitArea";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import callAPI from "../utils/callAPI";
import useSocket from "../utils/useSocket";
import CustomButton from "../Components/CustomButton";
import DrawingTurn from "../Components/DrawingTurn";
import OneDrawFinish from "../Components/onedrawfinish";
import ResultBox from "../Components/ResultBox";
import "../Components/WaitDraw.css";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";
import "./DrawFinish.css";
import { IoTimerOutline } from "react-icons/io5";
import { Audio } from  'react-loader-spinner'

function Joining() {
  // const [turn, setTurn] = useState("");
  const params = useParams();

  const { start, startFun, setRoomId, choosenWord, userId, turn, setTurn, drawingAllFinish, onePersonDrawingTurnFinish } =
    useContext(WebSocketContext);

  useEffect(() => {
    setRoomId(params.roomID);
  }, []);

  // const message = async () => {
  //     let response_obj = await callAPI({
  //         endpoint: `/game_turn/${params.roomID}/${userId}`,
  //     });
  //     setTurn(response_obj.data)
  //     console.log("Turn: ", response_obj.data)
  //   };

  // useEffect(() => {
  //     message();
  // }, []);

  return (
    <Grid item className="joining_root">
      {/* {setIsReady(true)} */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction={"column"}
        className="joining_main"
      >
        {turn == null 
        ? (
          // <></>
          <Audio
              height = "80"
              width = "80"
              radius = "9"
              color = 'green'
              ariaLabel = 'three-dots-loading'     
              wrapperStyle
              wrapperClass
            />)
        :( 
        <Grid>
          <Grid item className="inside_name">
            <img height={50} src={require("../assets/logo.png")} />
          </Grid>
          <Grid item className="joining_statusbar">
            <StatusBar/>
          </Grid>
          <Grid item className="main_area">
            <Grid
              container
              direction="row"
              // justifyContent="center"
              // alignItems="center"
            >
              <Grid item>
                <MemberBar />
              </Grid>
                <Grid>
                  {drawingAllFinish
                  ? <ResultBox />
                  : onePersonDrawingTurnFinish 
                  ? (<OneDrawFinish/>)
                  : start ? (
                    <DrawingTurn />
                  ) : (
                    <Grid item className="kheni_draw">
                      <Grid item className="waitdraw_root">
                        <Grid container direction="column">
                          <Grid item className="waiting_draw"></Grid>
                          <Grid item className="waiting_start">
                            {turn.data.turn_user_id == userId &&
                            turn.data.turn == true ? (
                              <CustomButton
                                name="Start"
                                addStyles={"waiting_start"}
                                onClicked={startFun}
                              />
                            ) : (
                              <CustomButton
                                name="Start"
                                addStyles={"waiting_start_dont_join"}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              <Grid item>
                <ChatBar />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default Joining;

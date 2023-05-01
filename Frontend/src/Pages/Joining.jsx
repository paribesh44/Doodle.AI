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
import "../Components/WaitDraw.css";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";
import "./DrawFinish.css";
import { IoTimerOutline } from "react-icons/io5";

function Joining() {
  // const [turn, setTurn] = useState("");
  const params = useParams();

  const { start, startFun, setRoomId, userId, turn, setTurn } =
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
        <Grid item className="inside_name">
          <img height={50} src={require("../assets/logo.png")} />
        </Grid>
        <Grid item className="joining_statusbar">
          {/* {start ? (
            <StatusBar message={turn.data.username} />
          ) : ( */}
          <StatusBar message="Waiting for Players to Join" />
          {/* )} */}
        </Grid>
        <Grid item className="main_area">
          <Grid
            container
            direction="row"
            // justifyContent="center"
            // alignItems="center"
          >
            <Grid item>
              {/* <MemberBar userSelfMessage={userSelfMessage} roomID={params.roomID}/> */}
              <MemberBar />
            </Grid>
            {turn == null ? (
              <></>
            ) : (
              <Grid>
                {start ? (
                  // <DrawingTurn user_id={user_id} turn={turn} roomID={params.roomID} sendMessage={sendMessage}/>
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
                )}{" "}
              </Grid>
            )}
            <Grid item>
              {/* <ChatBar messages={messages} user_id={user_id} sendMessage={sendMessage} ws={ws}/> */}
              <ChatBar />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Joining;

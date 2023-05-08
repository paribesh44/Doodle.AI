import React, { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./StatusBar.css";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function StatusBar() {
  const {
    timerClock,
    setTimerClock,
    timesUp,
    setTimesUp,
    drawingAllFinish,
    openCanvas,
    choosenWord,
    userId,
    turn,
    userSelfMessage,
    onePersonDrawingTurnFinish,
    turnFinished,
  } = useContext(WebSocketContext);

  // let [timerClock, setTimerClock] = useState(5);

  const underscores = [];

  if (choosenWord != null) {
    for (let i = 0; i < choosenWord.data.length; i++) {
      underscores.push(<span key={i}>_ </span>);
    }
  }

  useEffect(() => {
    const timer = setInterval(function () {
      // console.log("TimerClock: ", timerClock)
      // console.log("TimesUp: ", timesUp)

      if (timerClock <= 0) {
        setTimerClock(0);
        setTimesUp(true);
      } else {
        if (choosenWord != null) {
          setTimerClock(timerClock - 1);
        }
      }
    }, 1000);

    if (choosenWord != null) {
      if (timesUp) {
        console.log("times ups vao ta");
        turnFinished();
      }
    }

    return () => {
      // this runs as the clean up function for the useEffect
      clearInterval(timer);
    };
  }, [choosenWord, timerClock, timesUp]);

  // if (timesUp) {
  //   function timeUP() {
  //     console.log("times ups vao ta")
  //   }
  // }

  return (
    <Grid item className="status_bar_main">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="status_container"
      >
        <Grid item>
          {userSelfMessage.length != 0 ? (
            <Grid item className=" number_members">
              {" "}
              {userSelfMessage.data.score.length} joined
            </Grid>
          ) : (
            <Grid item className=" number_members">
              {" "}
              1 joined
            </Grid>
          )}
        </Grid>

        <Grid item className="status_message">
          {/* <Grid container alignItems={"center"} justifyContent="center"> */}
          {drawingAllFinish ? (
            <Grid item>Game Finished</Grid>
          ) : onePersonDrawingTurnFinish ? (
            <Grid item>Turn Finished</Grid>
          ) : choosenWord == null ? (
            <Grid item>Waiting</Grid>
          ) : turn.data.turn_user_id == userId && turn.data.turn == true ? (
            <Grid>
              <Grid>DRAW THIS</Grid>
              <Grid>{choosenWord.data.word}</Grid>
            </Grid>
          ) : (
            <Grid item>
              <Grid>GUESS THIS</Grid>
              <Grid>
                {underscores}&nbsp;<sup>{choosenWord.data.length}</sup>
              </Grid>
            </Grid>
          )}
          {/* </Grid> */}
        </Grid>

        <Grid item>
          {timesUp ? (
            "TIme's Up"
          ) : (
            <Grid item className="app_desct">
              {timerClock}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default StatusBar;

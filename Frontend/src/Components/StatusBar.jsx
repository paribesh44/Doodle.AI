import React, { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./StatusBar.css";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";
import { TfiAlarmClock } from "react-icons/tfi";
import sound from "./../assets/sounds/10sec.mp3";

function StatusBar() {
  const [tensec, settensec] = useState(false);
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

  // if (timerClock <= 28) {
  //   settensec(true);
  // }

  // if (tensec) {
  //   new Audio(sound).play();
  // }
  // let [timerClock, setTimerClock] = useState(5);

  // const customIcon = (props) => {
  //   return (
  //     <div>
  //       <CiTimer />
  //       <div>props.value</div>
  //     </div>
  //   );
  // };

  const underscores = [];

  if (choosenWord != null) {
    for (let i = 0; i < choosenWord.data.length; i++) {
      underscores.push(<span key={i}>_ </span>);
    }
  }

  useEffect(() => {
    console.log("choosenWord: ", choosenWord)
    console.log("timerclock: ", timerClock)
    console.log("timesUp: ", timesUp)
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

  var spaceLength = 0;

  const renderString = () => {
    return Array.from(choosenWord.data.word).map((char, index) => {
      if (char === ' ') {
        spaceLength += 1;
        return <span key={index}>&nbsp;&nbsp;</span>; // Render a space
      } else {
        return <span key={index}>_&nbsp;</span>; // Render an underscore
      }
    });
  }

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
                {renderString()}
                {/* {underscores}&nbsp;<sup>{choosenWord.data.length}</sup> */}
                <sup>{choosenWord.data.length-spaceLength}</sup>
              </Grid>
            </Grid>
          )}
          {/* </Grid> */}
        </Grid>

        <Grid item>
          {timesUp ? (
            <Grid item className="app_desct">
              Time's Up
            </Grid>
          ) : (
            <Grid item className="app_desct">
              <Grid container direction="row" alignItems={"center"}>
                <Grid item>
                  {" "}
                  <TfiAlarmClock size={30} />
                </Grid>
                <Grid item className="insideclock">
                  {timerClock}
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default StatusBar;

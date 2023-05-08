import { Grid } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";
import CustomButton from "../Components/CustomButton";

function OneDrawFinish() {
  const { startAgain, choosenWord, userId, turn, setTurn, userSelfMessage } =
    useContext(WebSocketContext);

  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  return (
    <Grid item className="draw_finishmain">
      <Grid item className="drawfinish_color">
        <Grid
          container
          direction="column"
          justifyContent="center"
          justifyItems="center"
          alignItems="center"
        >
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="center"
              justifyItems="center"
              alignItems="center"
            >
              <Grid item>{/* <IoTimerOutline /> */}</Grid>
              <Grid item className="timesup">
                Time's Up
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="center"
              justifyItems="center"
              alignItems="center"
              className="wordwas_cont"
            >
              <Grid item className="wordwas">
                The word was
              </Grid>
              <Grid item className="actual_word">
                {choosenWord.data.word}
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="name_pts_pts">
            <Grid
              container
              direction="column"
              // justifyContent="space between"
            >
              <Grid item>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  justifyItems="center"
                  alignItems="center"
                  className="name_ptscont"
                >
                  <Grid item className="name_score">
                    NAMES
                  </Grid>
                  <Grid item className="name_score">
                    POINTS
                  </Grid>
                </Grid>
                <Grid item>
                  <hr />
                </Grid>

                {userSelfMessage.data.players.map((val, key) => {
                  return (
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      justifyItems="center"
                      alignItems="center"
                      className="name_ptscont"
                    >
                      <Grid item className="name_score">
                        {val}
                      </Grid>
                      <Grid item className="pts_score">
                        + {userSelfMessage.data.score[key]}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {console.log("Turn: ", turn)}
      {turn.data.turn_user_id !== userId || turn.data.turn_username === "AI" ? (
        <CustomButton
          name="Start Again"
          addStyles={"waiting_start"}
          onClicked={startAgain}
        />
      ) : (
        <Grid container direction="column">
          {" "}
          <CustomButton
            name="Start Again (Wait for Starter to start again)"
            addStyles={"waiting_start_dont_join"}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
          />
        </Grid>
      )}

      {}
    </Grid>
  );
}
export default OneDrawFinish;

import { Grid } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";
import CustomButton from "../Components/CustomButton";


function OneDrawFinish() {

  const { startAgain, choosenWord, userId, turn, setTurn, userSelfMessage } = useContext(WebSocketContext);

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
          <Grid container direction="column" className="name_pts_pts">
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
                <Grid item className="pts_score">
                  POINTS
                </Grid>
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
      { turn.data.turn_user_id !== userId
        ? ( <CustomButton
        name="Start Again"
        addStyles={"waiting_start"}
        onClicked={startAgain}
      /> )
      : (
        <CustomButton
          name="Start Again"
          addStyles={"waiting_start_dont_join"}
        />
      )
      }

      {}
      
    </Grid>
    
  );

}
export default OneDrawFinish;


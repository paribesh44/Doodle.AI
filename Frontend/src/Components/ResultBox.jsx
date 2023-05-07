import React, { useState, useContext } from "react";
import { Avatar, Grid } from "@mui/material";
import "./WaitDraw.css";
import CustomButton from "./CustomButton";
import "./ResultBox.css";
import { dummyresults } from "./dummyresults";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";


function ResultBox() {

  const { userId, turn, drawingAllFinish, userSelfMessage, allTurnFinished } =
    useContext(WebSocketContext);

  return (
    <Grid item className="drawingturn_main">
      <Grid container direction="column">
        <Grid item className="drawingturncolor">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {userSelfMessage.data.players.map((val, key) => {
                return (
                  <Grid item className="each_bottom">
                    <Grid
                      container
                      direction={"column"}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <Avatar
                          src={require(`./../assets/${userSelfMessage.data.avatars[key]}.svg`)}
                          sx={{ width: 85, height: 85 }}
                        />
                      </Grid>

                      <Grid item className="ranking">
                        #1
                      </Grid>
                      <Grid item className="ranked_name">
                        {val}
                      </Grid>
                      <Grid item className="ranked_points">
                        Score:{" "}{userSelfMessage.data.score[key]}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <CustomButton 
          name="Game Restart" 
          addStyles={"waiting_start"} 
          onClicked={allTurnFinished}/>
        </Grid>
          
      </Grid>
  );
}

export default ResultBox;

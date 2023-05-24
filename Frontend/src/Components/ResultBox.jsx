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
    <Grid item className="resultbox_root">
      <Grid item className="resultbox_main">
        <Grid container direction="column" justifyContent="center">
          <Grid item className="mathi">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {userSelfMessage.data.players.map((val, key) => {
                return (
                  <Grid item>
                    {userSelfMessage.data.rank[key] == "1" ? (
                      <Grid
                        container
                        direction={"column"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item className="ranking_first">
                          #{userSelfMessage.data.rank[key]}
                        </Grid>
                        <Grid item>
                          <Avatar
                            src={require(`./../assets/${userSelfMessage.data.avatars[key]}.svg`)}
                            sx={{ width: 95, height: 95 }}
                          />
                        </Grid>

                        <Grid item className="ranked_name">
                          {val}
                        </Grid>
                        <Grid item className="ranked_points">
                          Score: {userSelfMessage.data.score[key]}
                        </Grid>
                      </Grid>
                    ) : null}
                  </Grid>
                );
              })}
            </Grid>

            <Grid item className="not_first_row">
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                {userSelfMessage.data.players.map((val, key) => {
                  return (
                    <Grid item className="">
                      <Grid item>
                        {userSelfMessage.data.rank[key] == "1" ? (
                          <Grid item className="first_skip"></Grid>
                        ) : (
                          <Grid
                            container
                            direction={"column"}
                            justifyContent="center"
                            alignItems="center"
                            className="each_bottom"
                          >
                            <Grid item className="ranking_second">
                              #{userSelfMessage.data.rank[key]}
                            </Grid>
                            <Grid item>
                              <Avatar
                                src={require(`./../assets/${userSelfMessage.data.avatars[key]}.svg`)}
                                sx={{ width: 90, height: 90 }}
                              />
                            </Grid>

                            <Grid item className="ranked_name">
                              {val}
                            </Grid>
                            <Grid item className="ranked_points">
                              Score: {userSelfMessage.data.score[key]}
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <CustomButton
              name="Game Restart"
              addStyles={"waiting_start"}
              onClicked={allTurnFinished}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ResultBox;

{
  /* {userSelfMessage.data.rank[key] == "1" ? (
                      <Grid
                        container
                        direction={"column"}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item className="ranking_first">
                          #{userSelfMessage.data.rank[key]}
                        </Grid>
                        <Grid item>
                          <Avatar
                            src={require(`./../assets/${userSelfMessage.data.avatars[key]}.svg`)}
                            sx={{ width: 95, height: 95 }}
                          />
                        </Grid>

                        <Grid item className="ranked_name">
                          {val}
                        </Grid>
                        <Grid item className="ranked_points">
                          Score: {userSelfMessage.data.score[key]}
                        </Grid>
                      </Grid>
                    ) : null} */
}

{
  /* {userSelfMessage.data.rank[key] == "3" ? (
                    <Grid
                      container
                      direction={"column"}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item className="ranking_third">
                        #{userSelfMessage.data.rank[key]}
                      </Grid>
                      <Grid item>
                        <Avatar
                          src={require(`./../assets/${userSelfMessage.data.avatars[key]}.svg`)}
                          sx={{ width: 85, height: 85 }}
                        />
                      </Grid>

                      <Grid item className="ranked_name">
                        {val}
                      </Grid>
                      <Grid item className="ranked_points">
                        Score: {userSelfMessage.data.score[key]}
                      </Grid>
                    </Grid>
                  ) : null} */
}

{
  /* <Grid
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
                      #{userSelfMessage.data.rank[key]}
                    </Grid>
                    <Grid item className="ranked_name">
                      {val}
                    </Grid>
                    <Grid item className="ranked_points">
                      Score: {userSelfMessage.data.score[key]}
                    </Grid>
                  </Grid> */
}

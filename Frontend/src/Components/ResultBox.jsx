import React from "react";
import { Avatar, Grid } from "@mui/material";
import "./WaitDraw.css";
import CustomButton from "./CustomButton";
import "./ResultBox.css";
import { dummyresults } from "./dummyresults";

function ResultBox() {
  return (
    <Grid item className="resultbox_root">
      <Grid container direction="column">
        <Grid item className="resultbox_main">
          <Grid
            container
            direction="row"
            justifyContent={"center"}
            alignItems="center"
          >
            <Grid item className="first_player" sx={{ height: 180 }}>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Avatar
                    src={require("./../assets/1.png")}
                    sx={{ width: 85, height: 85 }}
                  />
                </Grid>

                <Grid item className="ranking">
                  #2
                </Grid>
                <Grid item className="ranked_name">
                  Name of the player
                </Grid>
                <Grid item className="ranked_points">
                  Points:1990
                </Grid>
              </Grid>
            </Grid>

            <Grid item className="first_player" sx={{ height: 230 }}>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Avatar
                    src={require("./../assets/1.png")}
                    sx={{ width: 85, height: 85 }}
                  />
                </Grid>

                <Grid item className="ranking">
                  #1
                </Grid>
                <Grid item className="ranked_name">
                  Name of the player
                </Grid>
                <Grid item className="ranked_points">
                  Points:1990
                </Grid>
              </Grid>
            </Grid>
            <Grid item className="first_player" sx={{ height: 170 }}>
              <Grid
                container
                direction={"column"}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Avatar
                    src={require("./../assets/1.png")}
                    sx={{ width: 85, height: 85 }}
                  />
                </Grid>

                <Grid item className="ranking">
                  #3
                </Grid>
                <Grid item className="ranked_name">
                  Name of the player
                </Grid>
                <Grid item className="ranked_points">
                  Points:1990
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="bottom_rankers">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {dummyresults.map((val, key) => {
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
                          src={require("./../assets/1.png")}
                          sx={{ width: 65, height: 65 }}
                        />
                      </Grid>

                      <Grid item className="ranking_bottom">
                        #{val.rank}
                      </Grid>
                      <Grid item className="ranked_namebottom">
                        {val.name}
                      </Grid>
                      <Grid item className="ranked_points">
                        Points:{val.pts}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item className="waiting_start">
          <CustomButton name="Start Again" addStyles={"waiting_start"} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ResultBox;

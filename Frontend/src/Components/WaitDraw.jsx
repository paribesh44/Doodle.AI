import React, { useState } from "react";
import { Avatar, Grid } from "@mui/material";
import "./WaitDraw.css";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";
import { dummtmembers } from "./dummymembers.jsx";

function WaitDraw() {
  return (
    <Grid item className="waitdraw_root">
      <Grid container direction="column">
        <Grid item className="waiting_draw"></Grid>
        <Grid item className="waiting_start">
          <Link to="/ObjecttoDraw">
            <CustomButton name="Start" addStyles={"waiting_start"} />
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default WaitDraw;

{
  /* <Grid item className="waitarea_main">
            <Grid container direction="column">
              <Grid item className="topic">
                Players Joined:
              </Grid>
              <Grid item>
                <Grid container direction="row">
                  {dummtmembers.map((val, key) => {
                    return (
                      <Grid item className="name_avatar">
                        <Grid
                          container
                          direction="column"
                          alignItems={"center"}
                        >
                          <Grid item>
                            <Avatar
                              src={require(`./../assets/${val.image}.svg`)}
                              sx={{ width: 65, height: 65 }}
                            />
                          </Grid>
                          <Grid item className="joinedname">
                            {val.name}{" "}
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <Grid item className="waiting_start">
                <Link to="/GamePage">
                  <CustomButton name="Start" addStyles={"waiting_start"} />
                </Link>
              </Grid>{" "}
            </Grid>
          </Grid> */
}

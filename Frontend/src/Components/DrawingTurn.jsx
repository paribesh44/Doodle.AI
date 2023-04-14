import { Grid } from "@mui/material";
import React from "react";
import "./DrawingTurn.css";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";

function DrawingTurn() {
  return (
    <Grid item className="drawingturn_main">
      <Grid container direction="column">
        <Grid item className="drawingturncolor">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item className="drawing_topic">
              Its your turn to draw:
            </Grid>
            <Grid item className="drawing_topic">
              You have to draw the following item:
            </Grid>
            <Grid item className="drawing_item">
              {"=>"} BasketBall
            </Grid>
            <Link to="/GamePage" style={{ textDecoration: "none" }}>
              <Grid item>
                <CustomButton
                  name="Start Drawing"
                  addStyles={"drawing_button"}
                />
              </Grid>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DrawingTurn;

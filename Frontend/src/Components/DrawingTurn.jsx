import { Grid } from "@mui/material";
import React from "react";
import "./DrawingTurn.css";

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
            <Grid item>Your drawing item is:</Grid>
            <Grid item>THis isfks</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DrawingTurn;

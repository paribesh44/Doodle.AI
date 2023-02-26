import React from "react";
import { Avatar, Grid } from "@mui/material";
import "./WaitDraw.css";
import CustomButton from "./CustomButton";

function WaitDraw() {
  return (
    <Grid item className="waitdraw_root">
      <Grid container direction="column">
        <Grid item className="waiting_draw"></Grid>
        <Grid item className="waiting_start">
          <CustomButton name="Start" addStyles={"waiting_start"} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default WaitDraw;

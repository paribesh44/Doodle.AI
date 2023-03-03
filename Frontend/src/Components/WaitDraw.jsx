import React from "react";
import { Avatar, Grid } from "@mui/material";
import "./WaitDraw.css";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";

function WaitDraw() {
  return (
    <Grid item className="waitdraw_root">
      <Grid container direction="column">
        <Grid item className="waiting_draw"></Grid>
        <Grid item className="waiting_start">
          <Link to="/GamePage">
            <CustomButton name="Start" addStyles={"waiting_start"} />
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default WaitDraw;

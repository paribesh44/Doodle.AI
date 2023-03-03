import React from "react";
import { Grid } from "@mui/material";
import "./StatusBar.css";

function StatusBar(props) {
  return (
    <Grid
      container
      className="status_bar_main"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item className=" number_members">
        {" "}
        3/10 joined
      </Grid>
      <Grid item className="status_message">
        <Grid container alignItems={"center"} justifyContent="center">
          <Grid item>{props.message}</Grid>
        </Grid>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default StatusBar;

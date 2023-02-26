import React from "react";
import { Grid } from "@mui/material";
import "./StatusBar.css";

function StatusBar() {
  return (
    <Grid
      container
      className="status_bar_main"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item> 3/10 joined</Grid>
      <Grid item> Waiting</Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default StatusBar;

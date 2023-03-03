import React from "react";
import { Grid } from "@mui/material";
import "./GameBar.css";

function GameBar() {
  return (
    <Grid
      container
      className="game_bar_main"
      direction="row"
      alignItems="center"
    >
      <Grid item className="whose_turn">
        Mr. Potato is drawing...{" "}
      </Grid>
      <Grid item className="hints">
        <Grid container justifyContent={"center"} alignItems="center">
          <Grid item>_ _ t _ _</Grid>
        </Grid>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default GameBar;

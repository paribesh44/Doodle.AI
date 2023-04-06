import React from "react";
import { Grid } from "@mui/material";
import "./GameBar.css";
import { CiTimer } from "react-icons/ci";

const word = "SPARKLING";
const output = word.split("").join(" ");

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
          <Grid item className="hint_section">
            {word.split("").map((val, key) => {
              return "__ ";
            })}
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid item className="timer_section">
          {/* <CiTimer size={25} /> */}
        </Grid>
        {/* <Grid item> 3s</Grid> */}
      </Grid>
    </Grid>
  );
}

export default GameBar;

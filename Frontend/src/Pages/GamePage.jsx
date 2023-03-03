import React from "react";
import { Grid } from "@mui/material";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import WaitDraw from "../Components/WaitDraw";
import GameBar from "../Components/GameBar";

function GamePage() {
  return (
    <Grid item className="joining_root">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction={"column"}
        className="joining_main"
      >
        <Grid item className="inside_name">
          Doodle.AI
        </Grid>
        <Grid item className="joining_statusbar">
          <GameBar />
        </Grid>
        <Grid item className="main_area">
          <Grid container direction="row">
            <Grid item>
              <MemberBar />
            </Grid>
            <Grid item className="kheni_draw">
              <WaitDraw />
            </Grid>
            <Grid item>
              <ChatBar />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default GamePage;

import React from "react";
import { Avatar, Grid } from "@mui/material";
import StatusBar from "../Components/StatusBar";
import MemberBar from "../Components/MemberBar";
import MainDraw from "../Components/WaitDraw";
import ChatBar from "../Components/ChatBar";
import "./Joining.css";
import WaitDraw from "../Components/WaitDraw";

function Joining() {
  return (
    <Grid item className="joining_root">
      <Grid
        container
        justifyContent={"center"}
        alignItems="center"
        direction={"column"}
        className="joining_main"
      >
        <Grid item className="inside_name">
          Doodle.AI
        </Grid>
        <Grid item className="joining_statusbar">
          <StatusBar />
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

export default Joining;

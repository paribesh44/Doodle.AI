import { Grid } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import GameBar from "../Components/GameBar";
import MemberBar from "../Components/MemberBar";
import DrawingTurn from "../Components/DrawingTurn";
import ChatBar from "../Components/ChatBar";

function ObjecttoDraw() {
  return (
    <Grid item className="joining_root">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction={"column"}
        className="joining_main"
      >
        <Link to="/Finalpage">
          <Grid item className="inside_name">
            <img height={50} src={require("../assets/logo.png")} />
          </Grid>
        </Link>

        <Grid item className="joining_statusbar">
          <GameBar />
        </Grid>
        <Grid item className="main_area">
          <Grid container direction="row">
            <Grid item>
              <MemberBar />
            </Grid>
            <Grid item className="canvas_main">
              <DrawingTurn />
              {/* <Canvas width={500} height={500} /> */}
            </Grid>
            <Grid item className="chat_chat">
              <ChatBar />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ObjecttoDraw;

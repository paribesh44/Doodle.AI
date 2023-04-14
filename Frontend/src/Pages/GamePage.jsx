import React from "react";
import { Grid } from "@mui/material";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import WaitDraw from "../Components/WaitDraw";
import GameBar from "../Components/GameBar";
import Canvas from "../Components/Canvas";
import "./GamePage.css";
import { Link } from "react-router-dom";
import DrawingTurn from "../Components/DrawingTurn";

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

export default GamePage;

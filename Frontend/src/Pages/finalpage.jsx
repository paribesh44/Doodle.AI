import React from "react";
import "./finalpage.css";
import { Grid } from "@mui/material";
import StatusBar from "../Components/StatusBar";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import ResultBox from "../Components/ResultBox";

function FinalPage() {
  console.log("thi si final page");

  return (
    <Grid item className="finalpage_root">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        class="finalpage_main"
      >
        <Grid item className="icon_length">
          <img height={50} src={require("../assets/logo.png")} />
        </Grid>
        <Grid item className="joining_statusbar">
          <StatusBar message="Game Finished" />
        </Grid>
        <Grid item className="main_area">
          <Grid container direction="row">
            <Grid item>
              <MemberBar />
            </Grid>
            <Grid item className="kheni_draw">
              <ResultBox />
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

export default FinalPage;

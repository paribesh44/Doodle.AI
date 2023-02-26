import React from "react";
import "./finalpage.css";
import { Grid } from "@mui/material";
import StatusBar from "../Components/StatusBar";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import ResultBox from "../Components/ResultBox";

function FinalPage() {
  return (
    <Grid item className="finalpage_root">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="row"
        class="finalpage_main"
      >
        <Grid item className="inside_name">
          Doodle.AI
        </Grid>
        <Grid item className="joining_statusbar">
          <StatusBar />
        </Grid>
        <Grid item>
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

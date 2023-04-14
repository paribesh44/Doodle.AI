import React, { useState } from "react";
import { Grid } from "@mui/material";
import StatusBar from "../Components/StatusBar";
import MemberBar from "../Components/MemberBar";
import ChatBar from "../Components/ChatBar";
import "./Joining.css";
import WaitDraw from "../Components/WaitDraw";
import WaitArea from "../Components/WaitArea";
import { Link } from "react-router-dom";

function Joining() {
  const [showDraw, setshowDraw] = useState(true);

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
          <img height={50} src={require("../assets/logo.png")} />
        </Grid>
        <Grid item className="joining_statusbar">
          <StatusBar message="Waiting" />
        </Grid>
        <Grid item className="main_area">
          <Grid
            container
            direction="row"
            // justifyContent="center"
            // alignItems="center"
          >
            <Grid item>
              <MemberBar />
            </Grid>
            <Grid item className="kheni_draw">
              {/* {showDraw && <WaitArea />} */}
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

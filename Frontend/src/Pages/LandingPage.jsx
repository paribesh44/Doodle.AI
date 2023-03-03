import React from "react";
import "./LandingPage.css";
import { Grid } from "@mui/material";
import LandingPageContainer from "../Components/LandingPageContainer";

function LandingPage() {
  console.log("landingpage");
  return (
    <Grid container className="landingmain ">
      <Grid item>
        <Grid
          container
          justifyContent="center"
          justifyItems="center"
          direction="column"
          alignItems="center"
        >
          <Grid item className="app_name">
            Doodle.AI
          </Grid>
          <Grid item className="app_desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Grid>
          <Grid item>
            <LandingPageContainer />
          </Grid>
          <Grid item className="bottom_bar">
            <Grid
              container
              direction="row"
              justifyContent={"center"}
              alignItems="center"
            >
              <Grid item className="bottomcenter_width">
                <Grid container justifyContent="space-between">
                  <Grid item>About Us</Grid>
                  <Grid item>How to play</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LandingPage;

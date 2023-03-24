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
            <img height={50} src={require("../assets/logo.png")} />
          </Grid>
          <Grid item className="app_desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Grid>
          <Grid item className="Landing_root">
            <LandingPageContainer />
          </Grid>
          <Grid item className="bottom_bar">
            <Grid container direction="column">
              <Grid item>
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
              <Grid item>
                <Grid
                  container
                  justifyContent={"center"}
                  alignItems="center"
                  direction="row"
                >
                  {/* <Grid item className="bottomcenter_width2">
                    <Grid container justifyContent={"space-between"}>
                      <Grid item className="about_us">
                        Welcome to Doodle.AI, the platform where creativity
                        meets artificial intelligence! We believe that everyone
                        has a creative spark, and our mission is to empower
                        individuals to express their imagination through the
                        power of AI technology. Our website is designed to
                        provide a fun and intuitive platform for users to create
                        doodles and see them come to life through AI. Whether
                        you're an artist, a student, or just looking to express
                        your creative side, Doodle.AI is the perfect platform
                        for you. At Doodle.AI, we're committed to pushing the
                        boundaries of what's possible with AI and creativity.
                        Our team of experts is constantly working to develop new
                        tools and features to enhance the doodling experience,
                        and we're dedicated to making sure that our platform is
                        accessible to everyone. So come join the fun and start
                        doodling with AI today!
                      </Grid>
                      <Grid item className="about_us">
                        <Grid container direction="column">
                          <Grid item>
                            When it's your turn, choose a word you want to draw!
                          </Grid>
                          <Grid item>
                            Try to draw your choosen word! No spelling!
                          </Grid>

                          <Grid item>
                            Let other players try to guess your drawn word!
                          </Grid>
                          <Grid item>
                            When it's not your turn, try to guess what other
                            players are drawing!
                          </Grid>
                          <Grid item>
                            Meanwhile, AI also tries guess the doodle and try to
                            compete against you
                          </Grid>
                          <Grid item>
                            Score the most points and be crowned the winner at
                            the end!
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid> */}
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

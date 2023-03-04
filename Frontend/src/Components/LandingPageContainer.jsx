import { React, useState } from "react";
import { Avatar, Grid } from "@mui/material";
import "./LandingPageContainer.css";
import CustomButton from "./CustomButton";
import Image from "./Image.jsx";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";

function LandingPageContainer() {
  const [username, setusername] = useState(null);
  const [avatarimg, setavatarimg] = useState(1);

  async function handleChange(e) {
    console.log(e.target.value);
  }

  const handlePrevious = () => {
    if (avatarimg == 1) {
      setavatarimg(10);
    } else {
      setavatarimg(avatarimg - 1);
    }
  };

  const handleNext = () => {
    if (avatarimg == 10) {
      setavatarimg(1);
    } else {
      setavatarimg(avatarimg + 1);
    }
  };
  return (
    <Grid
      container
      className="LandingContainer"
      justifyContent={"center"}
      alignItems="center"
      direction={"column"}
    >
      <Grid item>
        <form>
          <input
            className="input_field"
            type="text"
            // value={this.state.value}
            placeholder="Enter your Name"
            onChange={handleChange}
          />
        </form>
      </Grid>
      {/* <Grid item className="avatar_title">
        Choose an avatar.
      </Grid> */}
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Grid item className="icon_button">
            <GrPrevious onClick={handlePrevious} size={21} />
          </Grid>
          <Grid item className="avatar_class">
            <Avatar
              src={require(`./../assets/${avatarimg}.svg`)}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item className="icon_button">
            <GrNext onClick={handleNext} size={21} />
          </Grid>
        </Grid>
      </Grid>
      <Link to="/GamePage">
        <Grid item>
          <CustomButton addStyles="createroombtn" name="Create a Room" />
        </Grid>
      </Link>

      <Grid item>
        <CustomButton addStyles="joinroombtn" name="Join a Room" />
      </Grid>
    </Grid>
  );
}

export default LandingPageContainer;

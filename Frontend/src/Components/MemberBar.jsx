import React from "react";
import { Avatar, Grid } from "@mui/material";
import "./MemberBar.css";
import dummymembers, { dummtmembers } from "./dummymembers.jsx";

function MemberBar() {
  return (
    <Grid item className="memberbar_root">
      <Grid container direction="column">
        {dummtmembers.map((val, key) => {
          return (
            <Grid item className={val.status ? "my_info" : "member_info"}>
              <Grid container direction="row" alignItems={"center"}>
                <Grid item>
                  <Avatar
                    src={require(`./../assets/${val.image}.png`)}
                    sx={{ width: 35, height: 35 }}
                  />
                </Grid>
                <Grid item className="member_name">
                  {val.name}
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

export default MemberBar;

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
            <Grid
              item
              className={val.status ? "my_info" : "member_info"}
              key={key}
            >
              <Grid
                container
                direction="row"
                // alignItems={"center"}
                justifyContent="center"
              >
                <Grid item className="rank_number">
                  #1
                </Grid>
                <Grid item>
                  <Avatar
                    src={require(`./../assets/${val.image}.svg`)}
                    sx={{ width: 35, height: 35 }}
                  />
                </Grid>
                <Grid item>
                  <Grid container direction="column" justifyContent={"center"}>
                    <Grid item className="member_name">
                      {val.name}
                    </Grid>
                    <Grid item className="member_pts">
                      Points:200
                    </Grid>
                  </Grid>
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

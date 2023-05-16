import React, { useState, useEffect, useContext } from "react";
import { Avatar, Grid } from "@mui/material";
import "./MemberBar.css";
import dummymembers, { dummtmembers } from "./dummymembers.jsx";
import callAPI from "../utils/callAPI";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function MemberBar() {

  const {userSelfMessage, turn, userId} = useContext(WebSocketContext);
  const [userName, setUserName] = useState([]);

  const message = async () => {
    let response_obj = await callAPI({
      endpoint: `/room/getUsername/${userId}`,
    });
    setUserName(response_obj.data);
  };

  useEffect(() => {
    message();
  }, []);

  return (
    <Grid item className="memberbar_root">
      { userSelfMessage.length != 0 ?
      <Grid container direction="column">
          {userSelfMessage.data.players.map((val, key) => {

          return (
            <Grid
            // turn.data.turn_username
              item
              className={ turn===null || userName===null ? "my_info"
                : userName == val 
                 ? "my_info" 
                 : turn.data.turn_username === val ? "turn_info" : "member_info"}
              key={key}
            >
              <Grid container direction="row" justifyContent="center">
                  <Grid item className="rank_number">
                    #{userSelfMessage.data.rank[key]}
                  </Grid>
                  <Grid item>
                    <Avatar
                      src={require(`./../assets/${userSelfMessage.data.avatars[key]}.svg`)}
                      sx={{ width: 35, height: 35 }}
                    />
                  </Grid>

                <Grid item>
                  <Grid container direction="column" justifyContent={"center"}>
                    <Grid item className="member_name">
                      {val}
                    </Grid>
                    <Grid item className="member_pts">
                      Score:{" "}{userSelfMessage.data.score[key]}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      : <></>}
    </Grid>
  );
// }
}

export default MemberBar;

import React from "react";
import { Grid } from "@mui/material";
import "./ChatBar.css";
import { dummymessages } from "./dummymessages.jsx";

function ChatBar() {
  return (
    <Grid item className="chatbar_root">
      <Grid container direction="row" alignItems="center">
        <Grid item className="chat_color">
          <Grid
            container
            direction="column"
            alignItems="start"
            justifyContent="space-evenly"
          >
            <Grid item xs={11} className="check">
              {dummymessages.map((val, key) => {
                return (
                  <Grid
                    item
                    key={key}
                    className={val.from == "Me" ? "my_eachmsg" : "each_message"}
                  >
                    {val.message}
                  </Grid>
                );
              })}
              <Grid item className="bottom_chat" xs={1}>
                <form>
                  <input
                    className="chat_box"
                    type="text"
                    placeholder="   Enter your Guess Here   "
                  ></input>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatBar;

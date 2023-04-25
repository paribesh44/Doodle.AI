import React, { useState, useContext } from "react";
import { Grid } from "@mui/material";
import "./ChatBar.css";
import { dummymessages } from "./dummymessages.jsx";
import CustomButton from "./CustomButton";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function ChatBar() {
  const [guess, setGuess] = useState("");

  const { history, sendMessage, userId } = useContext(WebSocketContext);

  async function submit() {
    // console.log(ws)
    if (guess !== "") {
      sendMessage({ msg_type: 3, data: guess, user_id: userId });
      setGuess("");
    }
  }

  // console.log("Message: ", messages)

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
            {console.log("Mesages ", history)}
            <Grid item xs={11} className="check">
              {/* { userJoinedMessage != "" ? 
                <Grid container direction="row">
                  <Grid item className="joined_message">
                    {userJoinedMessage.username} joined the room!
                    </Grid>
                </Grid>
              : null}
              { userLeftMessage != "" ? 
                <Grid container direction="row">
                  <Grid item className="left_message">
                    {userLeftMessage.username} left the room!
                    </Grid>
                </Grid>
              : null} */}
              {/* {msg_type: 1, data: 'connected', user: 1, username: 'ishan panta', time: '2023-04-16T05:31:47.843615'} */}
              {history.map((val, key) => {
                return (
                  <Grid
                    item
                    key={key}
                    className={
                      val.user == userId ? "my_eachmsg" : "each_message"
                    }
                  >
                    <Grid container direction="row">
                      <Grid item className="sender_name">
                        {val.data == "connected" || val.data == "disconnected"
                          ? null
                          : val.user == userId
                          ? `You: `
                          : `${val.username}: `}
                      </Grid>
                      {val.data == "connected" ? (
                        <Grid item className="joined_message">
                          {val.user == userId ? "You" : val.username} joined the
                          room!
                        </Grid>
                      ) : val.data == "disconnected" ? (
                        <Grid item className="left_message">
                          {val.user == userId ? "You" : val.username} left the
                          room!
                        </Grid>
                      ) : (
                        <Grid item>&nbsp;{val.data}</Grid>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
              <Grid item className="bottom_chat" xs={1}>
                <form>
                  <input
                    className="chat_box"
                    type="text"
                    placeholder="   Enter your Guess Here   "
                    onChange={(e) => setGuess(e.target.value)}
                  ></input>
                  {/* <input type="submit" onSubmit={submit}/> */}
                </form>
                <Grid item className="submittheMessage">
                  <CustomButton
                    addStyles="thesubbmit"
                    name="Submit"
                    onClicked={submit}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatBar;

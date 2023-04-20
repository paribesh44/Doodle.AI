import React, { useState } from "react";
import { Grid } from "@mui/material";
import "./ChatBar.css";
import { dummymessages } from "./dummymessages.jsx";
import CustomButton from "./CustomButton";


function ChatBar(props) {

  const [guess, setGuess] = useState("");

  var ws = props.ws

  console.log(props.messages)

  async function submit() {
    // console.log(ws)
    if(guess != "") {
      console.log(guess)
      props.sendMessage(ws, {msg_type:3, data:guess, user_id:props.user_id})
      setGuess("")
    }
  }
  
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
              {/* { props.userJoinedMessage != "" ? 
                <Grid container direction="row">
                  <Grid item className="joined_message">
                    {props.userJoinedMessage.username} joined the room!
                    </Grid>
                </Grid>
              : null}
              { props.userLeftMessage != "" ? 
                <Grid container direction="row">
                  <Grid item className="left_message">
                    {props.userLeftMessage.username} left the room!
                    </Grid>
                </Grid>
              : null} */}
              {/* {msg_type: 1, data: 'connected', user: 1, username: 'ishan panta', time: '2023-04-16T05:31:47.843615'} */}
              {props.messages.map((val, key) => {
                return (
                  <Grid
                    item
                    key={key}
                    className={val.user == props.user_id ? "my_eachmsg" : "each_message"}
                  >
                    <Grid container direction="row">
                      <Grid item className="sender_name">
                        {val.data == "connected" || val.data == "disconnected" 
                        ? null
                        : val.user == props.user_id ? 
                          `You: ` : `${val.username}: `}
                      </Grid>
                      {val.data == "connected" ? 
                        <Grid item className="joined_message">{val.user == props.user_id ? "You" : val.username} joined the room!</Grid>
                        : val.data == "disconnected" ?
                          <Grid item className="left_message">{val.user == props.user_id ? "You" : val.username} left the room!</Grid>
                          : <Grid item>&nbsp;{val.data}</Grid>
                      }
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
                <CustomButton addStyles="submitMessage" name="Submit" onClicked={submit}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatBar;

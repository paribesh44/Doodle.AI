import React, { useState, useContext } from "react";
import { Grid } from "@mui/material";
import "./ChatBar.css";
import { dummymessages } from "./dummymessages.jsx";
import CustomButton from "./CustomButton";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function ChatBar() {
  const [guess, setGuess] = useState("");

  const { history, drawingAllFinish, sendMessage, userId, choosenWord, guessCorrect, setGuessCorrect, onePersonDrawingTurnFinish } = useContext(WebSocketContext);

  async function submit(e) {
    e.preventDefault();
    // console.log(ws)
    if (guess !== "") {
      sendMessage({ msg_type: 3, data: guess, user_id: userId });
      setGuess("");
      if (choosenWord.data.word === guess) {
        setGuessCorrect(true)
      }
    }
  }

  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      submit(event);
    }
  };

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
            {/* {console.log("Mesages ", history)} */}
            <Grid item xs={11} className="check">
              {history.map((val, key) => {
                return (
                  <Grid
                    item
                    key={key}
                    className={ choosenWord === null 
                      ? val.user == userId ? "my_eachmsg" : "each_message"
                      :choosenWord.data.word === val.data 
                        ? <></>
                        : val.user == userId ? "my_eachmsg" : "each_message"
                    }
                  >
                    <Grid container direction="row">
                      <Grid item className="sender_name">
                        { choosenWord === null
                        ? (val.msg_type===12 
                          ? <Grid item className="ai_message">AI:</Grid>
                          : val.data === "connected" || val.data === "disconnected" 
                            ? null
                            : val.user === userId 
                              ? `You: ` 
                              : `${val.username}: `)
                        : (choosenWord.data.word === val.data 
                        ?<></>
                        :val.msg_type===12 
                          ? <Grid item className="ai_message">AI:</Grid>
                          : val.data === "connected" || val.data === "disconnected" 
                            ? null
                            : val.user === userId 
                              ? `You: ` 
                              : `${val.username}: `)}
                      </Grid>
                      {val.msg_type===12 
                        ? <Grid item className="ai_message">&nbsp;{val.data}</Grid>
                        : val.data == "connected" 
                          ? <Grid item className="joined_message">{val.user == userId ? "You" : val.username} joined the room!</Grid>
                          : val.data == "disconnected" 
                            ? <Grid item className="left_message">{val.user == userId ? "You" : val.username} left the room!</Grid>
                            : choosenWord === null
                            ? <Grid item>&nbsp;{val.data}</Grid>
                            : choosenWord.data.word === val.data
                              ?(<Grid item className="guessCorrect">
                                {val.user === userId ? "You guessed the word!" : `${val.username} guessed the word!`}
                                </Grid>)
                              :<Grid item>&nbsp;{val.data}</Grid>
                      }
                    </Grid>
                  </Grid>
                );
              })}
              <Grid item className="bottom_chat" xs={1}>
                { guessCorrect || drawingAllFinish || onePersonDrawingTurnFinish
                ?<form>
                  <input
                    disabled
                    className="chat_box"
                    type="text"
                    placeholder="   Enter your Guess Here   "
                    value = "   Enter your Guess Here   "
                  ></input>
                  <button disabled className="disablethesubbmit">Submit</button>
                </form>

                :<form onSubmit={submit}>
                  <input
                    className="chat_box"
                    type="text"
                    value={guess}
                    placeholder="   Enter your Guess Here   "
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  ></input>
                  <button type="submit" className="thesubbmit">Submit</button>
                </form>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatBar;

import React, { useState, useContext, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import "./ChatBar.css";
import { dummymessages } from "./dummymessages.jsx";
import CustomButton from "./CustomButton";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function ChatBar() {
  const [guess, setGuess] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const {
    giveUserScoreFun,
    history,
    drawingAllFinish,
    sendMessage,
    userId,
    choosenWord,
    guessCorrect,
    setGuessCorrect,
    onePersonDrawingTurnFinish,
    turn,
  } = useContext(WebSocketContext);

  useEffect(() => {
    scrollToBottom();
    // if (messagesEndRef && messagesEndRef.current) {
    //   const element = messagesEndRef.current;
    //   element.scroll({
    //     top: element.scrollHeight,
    //     left: 0,
    //     behavior: "smooth",
    //   });
    // }
  }, [guess, history]);

  async function submit(e) {
    e.preventDefault();
    // console.log(ws)
    if (guess !== "") {
      sendMessage({ msg_type: 3, data: guess, user_id: userId });
      setGuess("");
      if (choosenWord.data.word === guess) {
        setGuessCorrect(true);
        // this function doesnot work for AI
        giveUserScoreFun();
      }
    }
  }

  const handleInputChange = (event) => {
    setGuess(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
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
            // alignItems="start"
            // justifyContent="space-evenly"
          >
            {/* <Grid item></Grid> */}
            {/* {console.log("Mesages ", history)} */}
            <Grid item xs={10} className="check">
              {history.map((val, key) => {
                return (
                  <Grid
                    item
                    key={key}
                    className={
                      choosenWord === null ? (
                        val.user == userId ? (
                          "my_eachmsg"
                        ) : (
                          "each_message"
                        )
                      ) : choosenWord.data.word === val.data ? (
                        <></>
                      ) : val.user == userId ? (
                        "my_eachmsg"
                      ) : (
                        "each_message"
                      )
                    }
                  >
                    <Grid container direction="row">
                      <Grid item className="sender_name">
                        {choosenWord === null ? (
                          val.msg_type === 12 ? (
                            <Grid item className="ai_message">
                              AI:
                            </Grid>
                          ) : val.data === "connected" ||
                            val.data === "disconnected" ? null : val.user ===
                            userId ? (
                            `You: `
                          ) : val.username === "AI" ? (
                            <Grid item className="ai_message">
                              AI:&nbsp;
                            </Grid>
                          ) : (
                            `${val.username}: `
                          )
                        ) : choosenWord.data.word === val.data ? (
                          <></>
                        ) : val.msg_type === 12 ? (
                          <Grid item className="ai_message">
                            AI:&nbsp;
                          </Grid>
                        ) : val.data === "connected" ||
                          val.data === "disconnected" ? null : val.user ===
                          userId ? (
                          `You: `
                        ) : val.username === "AI" ? (
                          <Grid item className="ai_message">
                            AI:&nbsp;
                          </Grid>
                        ) : (
                          `${val.username}: `
                        )}
                      </Grid>
                      {val.msg_type === 12 ? (
                        <Grid item className="ai_message">
                          &nbsp;{val.data}
                        </Grid>
                      ) : // turn.data.turn_user_id  === userId
                      // ? (
                      //   <Grid item className="ai_message">
                      //     &nbsp;{val.data}
                      //   </Grid>
                      // )
                      // :
                      // choosenWord.data.word !== val.data
                      //  ? (<Grid item className="ai_message">
                      //       &nbsp;{val.data}
                      //     </Grid>
                      //     )
                      //   : (<Grid item className="guessCorrect">
                      //       AI guessed the word!
                      //      </Grid>)

                      // <Grid item>
                      //   {console.log("val.data: ", val.data)}
                      // {turn.data.turn_user_id === userId
                      //    ? (<Grid item className="ai_message">
                      //       {val.data}
                      //     </Grid>)
                      //    : (choosenWord.data.word !== val.data
                      //      ? (<Grid item className="ai_message">
                      //         {val.data}
                      //       </Grid>)
                      //      : (
                      //       <Grid item className="guessCorrect">
                      //         AI guessed the word!
                      //       </Grid>
                      //      ))}
                      // </Grid>

                      val.data == "connected" ? (
                        <Grid item className="joined_message">
                          {val.user == userId ? "You" : val.username} joined the
                          room!
                        </Grid>
                      ) : val.data == "disconnected" ? (
                        <Grid item className="left_message">
                          {val.user == userId ? "You" : val.username} left the
                          room!
                        </Grid>
                      ) : choosenWord === null ? (
                        // <Grid item>&nbsp;{val.data}</Grid>
                        val.username === "AI" ? (
                          <Grid item className="ai_message">
                            &nbsp;{val.data}
                          </Grid>
                        ) : (
                          <Grid item>&nbsp;{val.data}</Grid>
                        )
                      ) : choosenWord.data.word === val.data ? (
                        <Grid item className="guessCorrect">
                          {val.user === userId
                            ? "You guessed the word!"
                            : val.username !== "AI"
                            ? `${val.username} guessed the word!`
                            : turn.data.turn_user_id !== userId
                            ? "AI guessed the word!"
                            : val.data}
                        </Grid>
                      ) : val.username === "AI" ? (
                        <Grid item className="ai_message">
                          &nbsp;{val.data}
                        </Grid>
                      ) : (
                        <Grid item>&nbsp;{val.data}</Grid>
                      )}
                    </Grid>
                    <div ref={messagesEndRef}></div>
                  </Grid>
                );
              })}
              {/* <div ref={messagesEndRef}></div> */}
            </Grid>

            <Grid item className="bottom_chat" xs={1}>
              {guessCorrect ||
              drawingAllFinish ||
              onePersonDrawingTurnFinish ? (
                <form>
                  <input
                    disabled
                    className="chat_box"
                    type="text"
                    placeholder="   Enter your Guess Here   "
                    value="   Enter your Guess Here   "
                  ></input>
                  <button disabled className="disablethesubbmit">
                    Submit
                  </button>
                </form>
              ) : (
                <form onSubmit={submit}>
                  <input
                    className="chat_box"
                    type="text"
                    value={guess}
                    placeholder="   Enter your Guess Here   "
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  ></input>
                  <button type="submit" className="thesubbmit">
                    Submit
                  </button>
                </form>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatBar;

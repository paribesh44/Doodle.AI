import { Grid } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import "./DrawingTurn.css";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";
import callAPI from "../utils/callAPI";
import Canvas from "../Components/Canvas";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

function DrawingTurn() {
  const [words, setWords] = useState([]);
  // const [allUserTurnFinished, setAllUserTurnFinished] = useState("");

  const {
    sendMessage,
    userId,
    roomId,
    openCanvas,
    activateCanvas,
    turn,
    test,
  } = useContext(WebSocketContext);

  const message = async () => {
    // if(roomId) {
    let response_obj = await callAPI({
      endpoint: `/game/give_words`,
    });
    setWords(response_obj.data);

    // let response_obj2 = await callAPI({
    //   endpoint: `/check-turn-finished/${roomId}`
    // });
    // setAllUserTurnFinished(response_obj2.data)
    // }
  };

  useEffect(() => {
    message();
  }, []);

  return (
    <Grid item className="canvas_main">
      {openCanvas ? (
        <Canvas width={500} height={500} />
      ) : (
        <Grid item className="drawingturn_main">
          <Grid container direction="column">
            <Grid item className="drawingturncolor">
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                {turn.data.turn_user_id == userId && turn.data.turn == true ? (
                  <Grid>
                    <Grid item className="drawing_item">
                      Choose a word
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {words.map((val, key) => {
                        return (
                          <Grid item marginRight={1} marginLeft={1}>
                            <CustomButton
                              name={val}
                              addStyles={"drawing_button"}
                              onClicked={activateCanvas}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item className="is_drawing_item">
                    {turn.data.username} is choosing word!
                  </Grid>
                )}

                {/* </Link> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default DrawingTurn;

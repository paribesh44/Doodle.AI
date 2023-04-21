import { Grid } from "@mui/material";
import React, {useState, useEffect} from "react";
import "./DrawingTurn.css";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";
import callAPI from "../utils/callAPI";
import Canvas from "../Components/Canvas";

function DrawingTurn(props) {
  const [words, setWords] = useState([]);
  const [openCanvas, setOpenCanvas] = useState(false);
  const [allUserTurnFinished, setAllUserTurnFinished] = useState("");


  const message = async () => {
      let response_obj = await callAPI({
          endpoint: `/game/give_words`,
      });
      setWords(response_obj.data);
      let response_obj2 = await callAPI({
        endpoint: `/check-turn-finished/${props.roomID}`
      });
      setAllUserTurnFinished(response_obj2.data)
    };

  useEffect(() => {
      message();
  }, []);
  
  function activateCanvas() {
    setOpenCanvas(true)
  }

  return (
    <Grid item className="canvas_main">
      { openCanvas ? 
        <Canvas width={500} height={500} />
        :
        <Grid item className="drawingturn_main">
          <Grid container direction="column">
            <Grid item className="drawingturncolor">
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              > 
              { props.turn.user_id == props.user_id && props.turn.turn == true ?
                <Grid>
                  <Grid item className="drawing_item">
                  Choose a word
                </Grid>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                  {words.map((val, key) => {
                    return (
                      <Grid item marginRight={1} marginLeft={1}>
                        <CustomButton
                          name={val}
                          addStyles={"drawing_button"}
                          onClicked={activateCanvas}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                </Grid>
                :
                <Grid item className="is_drawing_item">
                  {props.turn.turn_username} is choosing word!
                </Grid>
                }
                  
                {/* </Link> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
    
  );
}

export default DrawingTurn;

// import { CanvasHooks } from "./CanvasHooks.jsx";

// const Canvas = ({ width, height }) => {
//   const setCanvasRef = CanvasHooks(onDraw);

//   function onDraw(ctx, point, prevPoint) {
//     ctx.fillStyle = "#ffffff";
//     ctx.beginPath();
//     ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
//     ctx.fill();
//     console.log("ondraw");
//     // drawLine(prevPoint, point, ctx, "#fffff", 15);
//   }

//   function drawLine(start, end, ctx, color, width) {
//     console.log("drawline");
//     start = start ?? end;
//     ctx.beginPath();
//     ctx.lineWidth = width;
//     ctx.strokeStyle = color;
//     ctx.moveTo(start.x, start.y);
//     ctx.lineTo(end.x, end.y);
//     ctx.stroke();
//   }
//   return (
//     <canvas
//       width={width}
//       height={height}
//       style={canvasStyle}
//       ref={setCanvasRef}
//       //reference to canvas
//     />
//   );
// };

// export default Canvas;

// const canvasStyle = { border: "1px solid lime" };

import React, { useEffect, useRef, useState, useContext, useSyncExternalStore } from "react";
import { Avatar, Grid, nativeSelectClasses } from "@mui/material";
import { BsFillPencilFill } from "react-icons/bs";
import { BsEraserFill } from "react-icons/bs";
import { GiBroom } from "react-icons/gi";
import { CgColorPicker } from "react-icons/cg";
import { WebSocketContext } from "../utils/contexts/WebSocketContext";

import "./Canvas.css";

function Canvas() {
  const colors = [
    { name: "red" },
    { name: "blue" },
    { name: "green" },
    { name: "orange" },
    { name: "pink" },
    { name: "black" },
    { name: "brown" },
  ];

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setisDrawing] = useState(false);
  const [pencolor, setpencolor] = useState("black");
  const [pensize, setpensize] = useState("3");
  const [showpensize, setshowpensize] = useState(false);
  const [changePencolor, setchangePencolor] = useState(false);
  const timeout = useRef(null);
  const [Cursor, setCursor] = useState("default");

  const [strokeX, setStrokeX] = useState([]);
  const [strokeY, setStrokeY] = useState([]);
  const [strokeT, setStrokeT] = useState([]);

  const {strokeFinished, restartCanvasAfterClearing, clearDrawingCanvas, clearCanvas, oneStrokeFinished, sendMessage, userId, drawingHistory,setdrawingHistory, turn, hostDrawing} = useContext(WebSocketContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 940;
    canvas.height = 568;
    // canvas.style.width = "100%";
    // canvas.style.height = "600%";
    // canvas.width = canvas.offsetWidth;
    // canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    context.scale(1, 1);

    contextRef.current = context;
  }, [contextRef]);

  useEffect(() => {
    if (turn.data.turn_user_id !== userId) {
      if (clearDrawingCanvas) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "aliceblue";
        context.fillRect(0, 0, canvas.width * 0.98, canvas.height);
      }
      if(hostDrawing === "True") {
        if (drawingHistory != null) {
          const canvas = canvasRef.current;
          contextRef.current = canvas.getContext("2d");
          contextRef.current.lineWidth = drawingHistory.data.pensize;
          contextRef.current.lineCap = "round";
          contextRef.current.strokeStyle = drawingHistory.data.pencolor;
          console.log(drawingHistory)

          if (strokeFinished) {
            contextRef.current.lineTo(drawingHistory.data.offsetX, drawingHistory.data.offsetY);
            contextRef.current.stroke();
            contextRef.current.beginPath();
            // contextRef.current.moveTo(drawingHistory.data.offsetX, drawingHistory.data.offsetY);
          } else {
            contextRef.current.lineTo(drawingHistory.data.offsetX, drawingHistory.data.offsetY);
            contextRef.current.stroke();
            contextRef.current.beginPath();
            contextRef.current.moveTo(drawingHistory.data.offsetX, drawingHistory.data.offsetY);
        
          }
        }
      } else if (hostDrawing === "False") {
        setdrawingHistory(null)
        console.log(drawingHistory)
      }
    }
    
  }, [drawingHistory,strokeFinished, hostDrawing, isDrawing, clearDrawingCanvas])

  const startDrawing = ({ nativeEvent }) => {
    // const { offsetX, offsetY } = nativeEvent;
    // contextRef.current.beginPath();
    // contextRef.current.moveTo(offsetX, offsetY);
    // console.log(nativeEvent);
    setisDrawing(true);
    restartCanvasAfterClearing()
    draw(nativeEvent);
    oneStrokeFinished("no")
  };

  const finishDrawing = () => {
    // send drawing to AI
    sendMessage({msg_type:11, data:{"strokeX":strokeX, "strokeY":strokeY, "strokeT":strokeT}, user_id:userId})
    oneStrokeFinished("yes")
    // setStrokeXYT([])
    setStrokeX([])
    setStrokeY([])
    setStrokeT([])
    
    setisDrawing(false);
    sendMessage({msg_type:10, data:false});
    contextRef.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    // for drawing in the canvas
    if (turn.data.turn_user_id === userId && turn.data.turn === true) {
      if (isDrawing) {
        setStrokeX([...strokeX, nativeEvent.offsetX]);
        setStrokeY([...strokeY, nativeEvent.offsetY]);
        const date = new Date(nativeEvent.timeStamp)
        setStrokeT([...strokeT, date.getMilliseconds()]);

        sendMessage({msg_type:10, data:true});
        sendMessage({msg_type:4, data:{"offsetX":nativeEvent.offsetX, "offsetY":nativeEvent.offsetY, "pencolor": pencolor, "pensize": pensize}, user_id:userId})

        const canvas = canvasRef.current;
        contextRef.current = canvas.getContext("2d");
        contextRef.current.lineWidth = pensize;
        contextRef.current.lineCap = "round";
        contextRef.current.strokeStyle = pencolor;

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
      } else {
        // return;
      }
    } else {
      // console.log("drawinng: ", drawingHistory)
    }
  };

  const settoDraw = () => {
    contextRef.current.globalCompositeOperation = "source-over";
    setpencolor("black");
    setpensize("3");
    // setCursor("crosshair");
    setshowpensize(!showpensize);
  };

  const settoClear = () => {
    clearCanvas()
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "aliceblue";
    context.fillRect(0, 0, canvas.width * 0.98, canvas.height);
    setshowpensize(false);
    setchangePencolor(false);
  };
  const settoErase = () => {
    setCursor("grabbing");
    setshowpensize(false);
    // contextRef.current.globalCompositeOperation = "destination-out";
    setpencolor("aliceblue");
    setpensize("20");
  };
  const settoColor = () => {
    setchangePencolor(!changePencolor);
  };

  const changePenStroke = (str) => () => {
    console.log("size  clicked");
    setpensize(str);
  };

  const chooseColor = (str) => () => {
    console.log("color  clicked");
    setpencolor(str);
  };

  return (
    <Grid item className="canvas_root">
      <Grid container>
        <Grid item className="canvas_part">
          <Grid container direction="column">
            <Grid item>
              <Grid container direction={"column"}>
                <Grid item>
                  <canvas
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                    width={20}
                    height={560}
                    style={{ cursor: Cursor }}
                  />
                </Grid>
              </Grid>
            </Grid>
            {turn.data.turn_user_id == userId && turn.data.turn == true ?
            <Grid item>
              <Grid
                container
                direction="row  "
                justifyContent="center"
                alignItems="center"
              >
                <Grid item className="show_pensize">
                  {showpensize ? (
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        justifyContent="end"
                        alignItems="center"
                      >
                        <Grid
                          item
                          className="each_penstroke"
                          onClick={changePenStroke("3")}
                        >
                          <Grid item className="small_dot"></Grid>
                        </Grid>
                        <Grid
                          item
                          className="each_penstroke"
                          onClick={changePenStroke("5")}
                        >
                          <Grid item className="medium_dot"></Grid>
                        </Grid>
                        <Grid
                          item
                          className="each_penstroke"
                          onClick={changePenStroke("10")}
                        >
                          <Grid item className="large_dot"></Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
                <Grid item className="option_buttons">
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      item
                      className="eachoption_button"
                      onClick={settoDraw}
                    >
                      <BsFillPencilFill size={25} className="the_icon">
                        {/* <button >Draw</button> */}
                      </BsFillPencilFill>

                      {/* <Avatar src={require(`./../assets/${draw}.jog`)} /> */}
                    </Grid>
                    <Grid
                      item
                      className="eachoption_button"
                      onClick={settoErase}
                    >
                      <BsEraserFill size={25} className="the_icon" />
                      {/* <button>Erase</button> */}
                    </Grid>
                    <Grid
                      item
                      className="eachoption_button"
                      onClick={settoClear}
                    >
                      <GiBroom size={28} className="the_icon" />
                    </Grid>
                    <Grid
                      item
                      className="eachoption_button"
                      onClick={settoColor}
                    >
                      <CgColorPicker size={28} className="the_icon" />
                      {/* <button>Color</button> */}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item className="change_color">
                  {changePencolor ? (
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {colors.map((val, key) => {
                          return (
                            <Grid
                              item
                              key={key}
                              className="eachcolorcircle"
                              style={{ backgroundColor: val.name }}
                              onClick={chooseColor(val.name)}
                            ></Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid> : <></>}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Canvas;

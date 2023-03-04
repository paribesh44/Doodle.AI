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

import React, { useEffect, useRef, useState } from "react";
import { Avatar, Grid } from "@mui/material";
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
    { name: "purple" },
  ];

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setisDrawing] = useState(false);
  const [pencolor, setpencolor] = useState("black");
  const [pensize, setpensize] = useState("3");
  const [showpensize, setshowpensize] = useState(false);
  const [changePencolor, setchangePencolor] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 568;
    // canvas.style.width = "100%";
    // canvas.style.height = "600%";
    // canvas.width = canvas.offsetWidth;
    // canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    context.scale(1, 1);

    contextRef.current = context;
  }, [contextRef]);

  const startDrawing = ({ nativeEvent }) => {
    // const { offsetX, offsetY } = nativeEvent;
    // contextRef.current.beginPath();
    // contextRef.current.moveTo(offsetX, offsetY);
    setisDrawing(true);
    draw(nativeEvent);
  };

  const finishDrawing = () => {
    setisDrawing(false);
    contextRef.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (isDrawing) {
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
      return;
    }
  };

  const settoDraw = () => {
    contextRef.current.globalCompositeOperation = "source-over";
    setpencolor("black");
    setpensize("3");
    setshowpensize(!showpensize);
  };

  const settoClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "aliceblue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setshowpensize(false);
  };
  const settoErase = () => {
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
              <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
                width={20}
                height={560}
              />
            </Grid>
            {showpensize ? (
              <Grid item className="show_pensize">
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid
                    item
                    className="each_penstroke"
                    onClick={changePenStroke("3")}
                  >
                    one
                  </Grid>
                  <Grid
                    item
                    className="each_penstroke"
                    onClick={changePenStroke("5")}
                  >
                    two
                  </Grid>
                  <Grid
                    item
                    className="each_penstroke"
                    onClick={changePenStroke("10")}
                  >
                    three
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            {changePencolor ? (
              <Grid item className="change_color">
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

            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <button onClick={settoDraw}>Draw</button>

                  {/* <Avatar src={require(`./../assets/${draw}.jog`)} /> */}
                </Grid>
                <Grid item>
                  <button onClick={settoErase}>Erase</button>
                </Grid>
                <Grid item>
                  <button onClick={settoClear}>Clear</button>
                </Grid>
                <Grid item>
                  <button onClick={settoColor}>Color</button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Canvas;

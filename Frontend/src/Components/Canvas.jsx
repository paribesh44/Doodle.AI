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
import { Grid } from "@mui/material";
import "./Canvas.css";

function Canvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setisDrawing] = useState(false);
  const [pencolor, setpencolor] = useState("black");
  const [pensize, setpensize] = useState("3");
  const timeout = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 590;
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
    setpensize("10");
  };
  const settoErase = () => {
    // contextRef.current.globalCompositeOperation = "destination-out";
    setpencolor("aliceblue");
    setpensize("30");
  };
  const settoColor = () => {
    console.log("change color");
    console.log(pencolor);
    setpencolor("red");
    console.log(pencolor);
  };
  // const settoClear = () => {
  //   contextRef.current.fillStyle = "white";
  //   contextRef.current.clearRect(0, 0, canvasRef.width, canvasRef.height);
  //   contextRef.current.fillRect(0, 0, canvasRef.width, canvasRef.height);
  // };
  return (
    <Grid item className="canvas_root">
      <Grid container>
        <Grid item className="canvas_part">
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
            width={20}
            height={585}
          />
        </Grid>
      </Grid>
      <Grid item>
        <button onClick={settoDraw}>Draw</button>
        <button onClick={settoErase}>Erase</button>
        {/* <button onClick={settoClear}>Clear</button> */}
        <button onClick={settoColor}>Color</button>
      </Grid>
    </Grid>
  );
}

export default Canvas;

import React, { useEffect, useRef } from "react";

export function CanvasHooks(onDraw) {
  useEffect(() => {
    return () => {
      console.log("use");
      //remove listener
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    };
  }, []);

  const canvasRef = useRef(null);

  const isDrawingRef = useRef(false);

  const mouseMoveListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) {
      canvasRef.current.removeEventListener(
        "mousedown",
        mouseDownListenerRef.current
      );
    }

    // current value of the canvas red
    canvasRef.current = ref;
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      console.log("the function called");

      if (isDrawingRef.current) {
        console.log("sss");
        const point = compute(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext("2d");
        if (onDraw) onDraw(ctx, point);
        console.log(point);
      }
    };
    mouseMoveListenerRef.current = mouseMoveListener;
    window.addEventListener("mousemove", mouseMoveListener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const listener = () => {
      isDrawingRef.current = true;
    };
    canvasRef.current.addEventListener("mousedown", listener);
    mouseDownListenerRef.current = listener;
  }

  function initMouseUpListener() {
    if (!canvasRef.current) return;
    const listener = () => {
      isDrawingRef.current = false;
    };
    window.addEventListener("mouseup", listener);
    mouseUpListenerRef.current = listener;
  }

  function compute(clientX, clientY) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      console.log(boundingRect.left);
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    } else {
      return null;
    }
  }
  return setCanvasRef;
}

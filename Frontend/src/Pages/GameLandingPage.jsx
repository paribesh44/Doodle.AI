import { Grid } from "@mui/material";
import React, { useState } from "react";
import ObjecttoDraw from "./ObjecttoDraw";
import FinalPage from "./finalpage";

function GameLandingPage() {
  const isDrawing = useState(false);
  const isGuessing = useState(!isDrawing);

  return (
    <Grid>
      {/* {/* {isGuessing && <FinalPage />} */}
      {isDrawing && <ObjecttoDraw />}
      {isDrawing ? <FinalPage /> : <ObjecttoDraw />}
    </Grid>
  );
}

export default GameLandingPage;

import { Avatar, Grid } from "@mui/material";
import React from "react";
import "./WaitArea.css";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

function WaitArea() {
  return (
    <div className="modals">
      <div className="overlay">
        <div className="modal-content"></div>
      </div>
    </div>
  );
}

export default WaitArea;

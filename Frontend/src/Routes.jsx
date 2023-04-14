import React from "react";
import { Route, useRoutes, Routes } from "react-router-dom";
import FinalPage from "./Pages/finalpage";
import GamePage from "./Pages/GamePage";
import Joining from "./Pages/Joining";
import LandingPage from "./Pages/LandingPage";
import WaitArea from "./Components/WaitArea";
import ObjecttoDraw from "./Pages/ObjecttoDraw";
import GameLandingPage from "./Pages/GameLandingPage";

const Routedpath = () => {
  const routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/Joining", element: <Joining /> },
    { path: "/GamePage", element: <GamePage /> },
    { path: "/FinalPage", element: <FinalPage /> },
    { path: "/WaitArea", element: <WaitArea /> },
    { path: "/ObjecttoDraw", element: <ObjecttoDraw /> },
    { path: "/GameLandingPage", element: <GameLandingPage /> },
  ]);
  return routes;
};
export default Routedpath;

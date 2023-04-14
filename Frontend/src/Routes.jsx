import React from "react";
import { Route, useRoutes, Routes } from "react-router-dom";
import FinalPage from "./Pages/finalpage";
import GamePage from "./Pages/GamePage";
import Joining from "./Pages/Joining";
import LandingPage from "./Pages/LandingPage";
import WaitArea from "./Components/WaitArea";

const Routedpath = () => {
  const routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/Joining", element: <Joining /> },
    { path: "/GamePage", element: <GamePage /> },
    { path: "/FinalPage", element: <FinalPage /> },
    { path: "/WaitArea", element: <WaitArea /> },
  ]);
  return routes;
};
export default Routedpath;

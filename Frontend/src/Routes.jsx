import React from "react";
import { Route, useRoutes, Routes } from "react-router-dom";
import FinalPage from "./Pages/finalpage";
import Joining from "./Pages/Joining";
import LandingPage from "./Pages/LandingPage";

const Routedpath = () => {
  const routes = useRoutes([
    { path: "/", element: <LandingPage /> },
    { path: "/Joining", element: <Joining /> },
    { path: "/FinalPage", element: <FinalPage /> },
  ]);
  return routes;
};
export default Routedpath;

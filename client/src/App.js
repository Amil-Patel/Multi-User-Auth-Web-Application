import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardRoute from "./routes/admin/DashboardRoute";
import LoginRoute from "./routes/LoginRoute";
import StudentRoute from "./routes/admin/StudentRoute";
import InstructureRoute from "./routes/admin/InstructureRoute";
import RoleRoute from "./routes/RoleRoute";
import UserRoute from "./routes/UserRoute";
import axios from "axios";
import { RoleContext } from "./pages/admin/layout/RoleContext";
import { useNavigate } from "react-router-dom";

const App = () => {


  return (
    <>
      <RoleContext>
        <LoginRoute />
        {/* {
        auth ? ( */}
        {/* // <> */}
        <DashboardRoute />
        <StudentRoute />
        <InstructureRoute />
        <RoleRoute />
        <UserRoute />
      </RoleContext>
      {/* </>
        // ) : (
          // <LoginRoute />
      //   )
    // } */}
    </>
  );

};

export default App;

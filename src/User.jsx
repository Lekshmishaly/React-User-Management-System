import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Components/User/Signup.jsx";
import Login from "./Components/User/Login.jsx";
import Home from "./Components/User/Home.jsx";
import ProtectedLogin from "./private/ProtectedLogin.jsx";
import ProtectedHome from "./private/ProtectedHome.jsx";
import NotFound from "./Components/NotFound.jsx";
function User() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedLogin>
            <Login />
          </ProtectedLogin>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedHome>
            <Home />
          </ProtectedHome>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default User;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Admin/login";
import Home from "./Components/Admin/Home";
import Dashboard from "./Components/Admin/Dashboard";
import AddNewUser from "./Components/Admin/AddNewUser";
import ProtectedAdminLogin from "./private/ProtectedAdminLogin";
import ProtectedAdminHome from "./private/ProtectedAdminHome";
import NotFound from "./Components/NotFound.jsx";
function Admin() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedAdminLogin>
            <Login />
          </ProtectedAdminLogin>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedAdminHome>
            <Home />
          </ProtectedAdminHome>
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/addnewuser" element={<AddNewUser />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Admin;

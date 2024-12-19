import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedLogin({ children }) {
  const userData = useSelector((store) => store.user.userDatas);
  if (userData) {
    return <Navigate to={"/home"} />;
  }
  return children;
}

export default ProtectedLogin;

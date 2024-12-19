import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedHome({ children }) {
  const userData = useSelector((store) => store.user.userDatas);
  if (!userData) {
    return <Navigate to={"/"} />;
  }
  return children;
}

export default ProtectedHome;

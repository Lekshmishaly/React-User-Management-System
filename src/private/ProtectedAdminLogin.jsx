import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedAdminLogin({ children }) {
  const adminData = useSelector((store) => store.admin.adminDatas);
  if (adminData) {
    return <Navigate to={"/admin/home"} />;
  }
  return children;
}

export default ProtectedAdminLogin;

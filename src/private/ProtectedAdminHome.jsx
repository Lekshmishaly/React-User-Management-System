import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedAdminHome({ children }) {
  const adminData = useSelector((store) => store.admin.adminDatas);

  if (!adminData) {
    return <Navigate to={"/admin/login"} />;
  }
  return children;
}

export default ProtectedAdminHome;

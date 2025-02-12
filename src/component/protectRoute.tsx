import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isLoggedIn = window.localStorage.getItem("accessToken");
  const userRole = window.localStorage.getItem("accessRole");

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

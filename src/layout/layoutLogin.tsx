import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LoginLayoutProps {
  children?: ReactNode; // Jadikan children optional
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default LoginLayout;

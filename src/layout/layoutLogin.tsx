import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LoginLayoutProps {
  children?: ReactNode; // Jadikan children optional
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Wrapper untuk konten layout */}
      <div className="flex w-full h-full">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default LoginLayout;

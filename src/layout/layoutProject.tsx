import React from "react";
import Sidebar from "./sidebar";
import DashboardHeader from "./dashboardHeader";

type Props = {
  children?: React.ReactNode;
};

const LayoutProject: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden", // Menghilangkan scroll horizontal
        overflowX: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px",
          flex: 1,
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <DashboardHeader />

        {/* Main Section */}
        <main style={{ padding: "20px", flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
};

export default LayoutProject;

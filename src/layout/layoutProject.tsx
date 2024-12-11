import React from "react";
import Sidebar from "./sidebar";

type Props = {
  children?: React.ReactNode;
};

const LayoutProject: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh", // Full viewport height
        width: "100vw",
        overflow: "hidden", // Prevent horizontal scroll and overflow
        position: "relative", // Prevent any overflow issues
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px", // Sidebar width (fixed)
          flex: 1,
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", // Ensure scrolling in main content if it overflows
        }}
      >
        {/* Main Section */}
        <main
          style={{
            padding: "20px",
            flex: 1,
            overflowY: "auto", // Allow vertical scrolling if content overflows
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutProject;


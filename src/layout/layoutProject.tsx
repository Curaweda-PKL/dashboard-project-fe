// LayoutProject.tsx
import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";

const LayoutProject: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen grid grid-cols-[250px_1fr] grid-rows-[auto_1fr]">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="p-6 bg-white overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default LayoutProject;


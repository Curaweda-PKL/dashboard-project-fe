import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";

const DashboardHeader: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#000" }}>Dashboard</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <IoMdNotificationsOutline size={24} style={{ color: "#00c853" }} />
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              backgroundColor: "#00c853",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            16
          </span>
        </div>

        {/* Messages */}
        <div style={{ position: "relative" }}>
          <IoMailOutline size={24} style={{ color: "#ff9100" }} />
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-10px",
              backgroundColor: "#ff9100",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "bold",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            28
          </span>
        </div>

        {/* User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: "bold", margin: 0 }}>User Name</p>
            <p style={{ fontSize: "0.8rem", color: "#777", margin: 0 }}>axyz@email</p>
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid #ddd",
            }}
          >
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="User Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

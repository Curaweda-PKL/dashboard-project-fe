import React from "react";
import { TbMailFilled } from "react-icons/tb";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";

const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 250,
        right: 0,
        zIndex: 1,
        borderBottom: "3px solid #ddd", // Added bottom border
      }}
    >
      <h1
        style={{
          fontSize: "2rem", // Increased font size
          fontWeight: "bold",
          color: "#000",
          marginLeft: "2rem",
        }}
      >
        Dashboard
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRight: "1px solid #ddd", paddingRight: "20px" }}>
          <MdNotifications size={24} style={{ color: "black" }} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            16
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderRight: "1px solid #ddd", paddingRight: "20px" }}>
          <TbMailFilled size={24} style={{ color: "black" }} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            28
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BiMenuAltLeft size={24} style={{ color: "#777", cursor: "pointer" }} />
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="User Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              borderRadius: "10px",
              padding: "10px",
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: "0.9rem", fontWeight: "bold", margin: 0, color: "#000" }}>User Name</p>
            <p style={{ fontSize: "0.8rem", color: "#777", margin: 0 }}>axyz@email</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

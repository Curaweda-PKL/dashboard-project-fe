import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaCommentDots, FaCalendarAlt, FaCog } from "react-icons/fa";

// Menu Sidebar Items
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: FaHome },
  { name: "Team", path: "/team", icon: FaUser },
  { name: "Messages", path: "/messages", icon: FaCommentDots },
  { name: "Calendar", path: "/calendar", icon: FaCalendarAlt },
  { name: "Settings", path: "/settings", icon: FaCog },
];

// Sidebar Component
const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#fff",
        color: "#000",
        height: "100vh", // Full viewport height
        padding: "70px 0 20px", // Header height plus some padding
        display: "flex",
        flexDirection: "column",
        position: "fixed", // Fixed to the left side
        left: 0,
        top: 0, // Header height
        borderRight: "1px solid #ddd",
        overflowY: "auto", // Scroll if needed
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: location.pathname === item.path ? "#000" : "#333",
                  backgroundColor: location.pathname === item.path ? "#00c853" : "transparent",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                <item.icon size={20} style={{ marginRight: "10px" }} />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;



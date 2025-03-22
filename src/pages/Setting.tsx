import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Setting: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("myaccount");
  const navigate = useNavigate();
  const location = useLocation();

  // Update activeTab berdasarkan URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/settings/profiles")) {
      setActiveTab("profiles");
    } else {
      setActiveTab("myaccount");
    }
  }, [location]);

  // Hanya dua tab: myaccount dan profiles
  const tabs = ["myaccount", "profiles"];
  const filteredTabs = tabs.filter((tab) =>
    tab.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(tab === "myaccount" ? "/settings" : `/settings/${tab}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#D9D9D9] p-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-white p-2 pl-10 w-full border rounded-full"
          />
        </div>

        {/* Tabs */}
        <ul>
          {filteredTabs.map((tab) => (
            <li
              key={tab}
              className={`p-2 text-left font-semibold rounded-full mb-2 cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-black shadow-md"
                  : "bg-transparent text-gray-700"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab === "myaccount" && "My Account"}
              {tab === "profiles" && "Profiles"}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#F5F5F5] p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Setting;

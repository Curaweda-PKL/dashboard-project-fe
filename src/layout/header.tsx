import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaUser, FaCalendarMinus } from "react-icons/fa6";
import { useState, useCallback } from "react";
import { MdExpandMore } from "react-icons/md";
import { TbMessageFilled } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { HiMail } from "react-icons/hi";

interface SidebarLink {
  name: string;
  path?: string;
  icon: keyof typeof iconMap;
  children?: SidebarLink[];
}

import iconMap from "./iconMap";
import sidebarLinks from "../layout/sidebar.json";

const Layout = () => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  }, []);

  const renderSubLinks = useCallback((link: SidebarLink) => {
    const isOpen = !!openSubmenus[link.name];
    const IconComponent = iconMap[link.icon];

    return (
      <li key={link.name} className="flex flex-col text-lg">
        <div
          className={`flex items-center justify-between cursor-pointer p-2 rounded ${
            isOpen ? "bg-white text-black shadow-md" : ""
          }`}
          onClick={() => link.children && toggleSubmenu(link.name)}
        >
          <div className="flex items-center">
            {IconComponent && <IconComponent className="mr-2" />}
            {link.name === "Team" && <FaUser className="mr-2" />}
            {link.name === "Messages" && <TbMessageFilled className="mr-2" />}
            {link.name === "Calendar" && <FaCalendarMinus className="mr-2" />}
            {link.name === "Settings" && <IoMdSettings className="mr-2" />}
            {link.path ? (
              <Link to={link.path}>{link.name}</Link>
            ) : (
              <span>{link.name}</span>
            )}
          </div>

          {link.children && (
            <MdExpandMore
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>

        {link.children && isOpen && (
          <ul className="ml-4 mt-2">
            {link.children
              .filter((subLink) => location.pathname.includes(subLink.path || ""))
              .map((subLink) => (
                <li key={subLink.path} className="my-1">
                  <NavLink
                    to={subLink.path || ""}
                    className={({ isActive }) =>
                      `block p-1 rounded ${
                        isActive
                          ? "text-[#76A8D8BF] font-semibold bg-green-700"
                          : "text-black hover:bg-green-600"
                      }`
                    }
                  >
                    {subLink.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        )}
      </li>
    );
  }, [openSubmenus, toggleSubmenu, location.pathname]);

  return (
    <div className="h-screen drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-white h-screen">
        <div className="mx-4 mt-4">
          <div className="justify-between p-2 bg-white rounded-lg navbar text-slate-800 border-b border-gray-300 shadow-md">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost bg-green-600 hover:bg-green-700 transition-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>

            <div className="flex items-center justify-start">
              <div className="text-2xl font-bold mr-8">Dashboard</div>
            </div>

            <div className="ml-auto">
              <div className="flex items-center justify-center">
                <div className="indicator mr-8">
                  <button>
                    <IoNotificationsSharp size={30} className="text-2xl font-bold" />
                    <span className="indicator-item w-6 h-6 flex items-center justify-center rounded-full text-xs text-bold text-white mt-1 bg-teal-600">
                      99+
                    </span>
                  </button>
                </div>

                <div className="indicator mr-8">
                  <button>
                    <HiMail size={30} className="text-2xl font-bold" />
                    <span className="indicator-item w-6 h-6 flex items-center justify-center rounded-full text-xs text-bold text-white mt-1 bg-amber-600">
                      99+
                    </span>
                  </button>
                </div>

                <details className="dropdown dropdown-end">
                  <summary className="btn btn-ghost hover:bg-transparent">
                    <div className="avatar">
                      <div className="w-8 border border-black rounded-full">
                        <img
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                          alt="Profile"
                          className="rounded-full cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm font-semibold lg:text-base">
                        Mochammad Faith
                      </p>
                      <p className="text-xs">axyz@gmail</p>
                    </div>
                  </summary>
                </details>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col m-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <div className="h-screen drawer-side border-r border-gray-300 shadow-md">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="min-h-full p-4 shadow-md min-w-52 menu bg-white text-black">
          <li className="text-center font-bold text-xl mb-10"></li>
          {sidebarLinks.map(renderSubLinks)}
        </ul>
      </div>
    </div>
  );
};

export default Layout;


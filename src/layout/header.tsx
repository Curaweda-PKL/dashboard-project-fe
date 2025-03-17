import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaUser, FaCalendarMinus } from "react-icons/fa6";
import { useState, useCallback, useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import { TbMessageFilled } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import NotificationsPopup from "../component/notificationsPopup";
import iconMap from "./iconMap";
import sidebarLinks from "../layout/sidebar.json";
import { UserSummary } from "../component/api/usersApi";
import usersApi from "../component/api/usersApi";

interface SidebarLink {
  name: string;
  path?: string;
  icon: keyof typeof iconMap;
  children?: SidebarLink[];
}

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi rekursif untuk mendapatkan judul halaman dari sidebarLinks
  const getPageTitle = (links: SidebarLink[], path: string): string => {
    if (path.includes("/settings")) return "Settings";
    for (const link of links) {
      if (link.path === path) return link.name;
      if (link.children) {
        const title = getPageTitle(link.children, path);
        if (title) return title;
      }
    }
    return "Dashboard";
  };

  // Update judul halaman berdasarkan lokasi
  useEffect(() => {
    const currentTitle = getPageTitle(sidebarLinks, location.pathname);
    setPageTitle(currentTitle);
  }, [location.pathname]);

  // Membuka submenu berdasarkan URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOpenSubmenus((prevState) => ({
        ...prevState,
        [location.pathname.split("/")[1]]: true,
      }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  }, []);

  // Ambil data user dari API agar username dan email muncul di header
  useEffect(() => {
    async function getUserData() {
      try {
        // Ganti "1" dengan id user yang sesuai atau ambil dari token / context autentikasi
        const userData = await usersApi.getUser("1");
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
    getUserData();
  }, []);

  // Menutup dropdown jika klik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B20000",
      cancelButtonColor: "#6D6D6D",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("logoutSuccess", "true");
        navigate("/auth/login");
      } else {
        console.log("Canceled logout");
      }
    });
  };

  const renderSubLinks = useCallback(
    (link: SidebarLink) => {
      const isOpen = !!openSubmenus[link.name];
      const IconComponent = iconMap[link.icon];
      return (
        <li key={link.name} className="flex flex-col text-xl">
          <div
            className={`flex items-center justify-between cursor-pointer p-2 rounded-full ${
              isOpen ? "bg-white text-black shadow-md" : ""
            }`}
            onClick={() => link.children && toggleSubmenu(link.name)}
          >
            <div className="flex items-center w-full">
              {link.path ? (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-full w-full ${
                      isActive
                        ? "bg-[#02CCFF] text-black font-semibold"
                        : "text-black hover:bg-blue-200"
                    }`
                  }
                >
                  {IconComponent && <IconComponent className="mr-2" />}
                  {link.name === "Team" && <FaUser className="mr-2" />}
                  {link.name === "Messages" && <TbMessageFilled className="mr-2" />}
                  {link.name === "Calendar" && <FaCalendarMinus className="mr-2" />}
                  {link.name === "Settings" && <IoMdSettings className="mr-2" />}
                  {link.name === "Account" && <FaLock className="mr-2" />}
                  {link.name}
                </NavLink>
              ) : (
                <span className="flex items-center">
                  {IconComponent && <IconComponent className="mr-2" />}
                  {link.name}
                </span>
              )}
            </div>
            {link.children && (
              <MdExpandMore
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
                        `block p-1 rounded-full ${
                          isActive
                            ? "text-[#76A8D8BF] font-semibold bg-[#02CCFF]"
                            : "text-black hover:bg-blue-200"
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
    },
    [openSubmenus, toggleSubmenu, location.pathname]
  );

  return (
    <div className="h-screen drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-white h-screen">
        <div className="mx-4 mt-4">
          <div className="justify-between p-2 bg-white rounded-lg navbar text-slate-800">
            {/* Mobile Sidebar Toggle */}
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
              <div className="text-5xl font-bold mr-8">{pageTitle}</div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center justify-center">
                <div className="indicator mr-10">
                  <button onClick={() => setShowNotifications(true)}>
                    <IoNotificationsSharp size={30} className="text-2xl font-bold" />
                    <span className="indicator-item w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white mt-1 bg-teal-600">
                      99+
                    </span>
                  </button>
                </div>
                <div className="border-l-2 h-12 mx-4 border-gray-300"></div>
                {/* Dropdown Profile */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    className="btn btn-ghost border flex items-center"
                    onClick={() => setShowProfileDropdown((prev) => !prev)}
                  >
                    <div className="avatar">
                      <div className="w-12 border border-black rounded-full">
                        <img
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                          alt="Profile"
                          className="rounded-full cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="hidden lg:block text-left ml-4">
                      <p className="text-lg font-semibold lg:text-xl">
                        {currentUser?.name}
                      </p>
                      <p className="text-sm">{currentUser?.email}</p>
                    </div>
                    <MdExpandMore className="ml-2" />
                  </button>
                  {showProfileDropdown && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                      <li>
                        <button
                          className="w-full text-left p-2 hover:bg-blue-200"
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate("/settings");
                          }}
                        >
                          Settings
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left p-2 hover:bg-blue-200"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col m-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <div className="h-screen drawer-side border-r border-gray-300 shadow-md">
        <ul className="min-h-full p-4 shadow-md min-w-52 menu bg-white text-black">
          <li>
            <img src="/src/assets/curaweda.png" className="mx-auto w-24 h-20" alt="Curaweda" />
          </li>
          {sidebarLinks.map(renderSubLinks)}
        </ul>
      </div>
      {showNotifications && <NotificationsPopup onClose={() => setShowNotifications(false)} />}
    </div>
  );
};

export default Layout;

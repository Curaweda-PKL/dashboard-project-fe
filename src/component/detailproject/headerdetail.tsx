import React from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderDetail: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex gap-4 mb-14">
      <Link
        to="/task"
        className={`py-2 px-5 font-bold rounded-full shadow-md ${
          location.pathname === "/task" ? "bg-[#02CCFF] text-black" : "bg-gray-200 text-black"
        }`}
      >
        Task
      </Link>
      <Link
        to="/timeline"
        className={`py-2 px-5 font-bold rounded-full ${
          location.pathname === "/timeline" ? "bg-[#02CCFF] text-black" : "bg-gray-200 text-black"
        }`}
      >
        Timeline
      </Link>
      <Link
        to="/summary"
        className={`py-2 px-5 font-bold rounded-full ${
          location.pathname === "/summary" ? "bg-[#02CCFF] text-black" : "bg-gray-200 text-black"
        }`}
      >
        Summary
      </Link>
    </div>
  );
};

export default HeaderDetail;

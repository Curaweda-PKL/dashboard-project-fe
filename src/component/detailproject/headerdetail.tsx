import React from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderDetail: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex gap-4 mb-5">
      <Link
        to="/task"
        className={`py-2 px-5 font-bold rounded-full shadow-md ${
          location.pathname === "/task" ? "bg-[#02CCFF] text-white" : "bg-[#6A6A6A] text-white"
        }`}
      >
        Task
      </Link>
      <Link
        to="/timeline"
        className={`py-2 px-5 font-bold rounded-full ${
          location.pathname === "/timeline" ? "bg-[#02CCFF] text-white" : "bg-[#6A6A6A] text-white"
        }`}
      >
        Timeline
      </Link>
      <Link
        to="/summary"
        className={`py-2 px-5 font-bold rounded-full ${
          location.pathname === "/summary" ? "bg-[#02CCFF] text-white" : "bg-[#6A6A6A] text-white"
        }`}
      >
        Summary
      </Link>
    </div>
  );
};

export default HeaderDetail;
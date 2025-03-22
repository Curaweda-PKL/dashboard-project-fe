import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const HeaderDetail: React.FC = () => {
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();

  const { projectName = "Default Project Name", pm = "Default PM", date = "Default Date", client = "Default Client" } =
    (location.state as { projectName?: string; pm?: string; date?: string; client?: string }) || {};

  return (
    <div className="flex gap-4 mb-5">
      <Link 
        to={`/project/${projectId}/task`}
        state={{ projectName, pm, date, client }}
        className={`py-2 px-5 font-bold rounded-full  ${
          location.pathname.includes("/task") ? "bg-[#02CCFF] text-white" : "bg-[#6A6A6A] text-white"
        }`}
      >
        Task
      </Link>
      <Link
        to={`/project/${projectId}/timeline`}
        state={{ projectName, pm, date, client }}
        className={`py-2 px-5 font-bold rounded-full ${
          location.pathname.includes("/timeline") ? "bg-[#02CCFF] text-white" : "bg-[#6A6A6A] text-white"
        }`}
      >
        Timeline
      </Link>
      <Link
        to={`/project/${projectId}/summary`}
        state={{ projectName, pm, date, client }}
        className={`py-2 px-5 font-bold rounded-full ${
          location.pathname.includes("/summary") ? "bg-[#02CCFF] text-white" : "bg-[#6A6A6A] text-white"
        }`}
      >
        Summary
      </Link>
    </div>
  );
};

export default HeaderDetail;
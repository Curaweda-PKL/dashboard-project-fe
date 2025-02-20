import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Project } from "../component/api/projectApi"; // Adjust path if needed

// --- Popup Components (unchanged) ---
interface PopupProps {
  title: string;
  duration: string;
  onClose: () => void;
  onDetail: () => void;
  onHold: () => void;
}

const Popup: React.FC<PopupProps> = ({
  title,
  duration,
  onClose,
  onDetail,
  onHold,
}) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/task");
    onDetail();
  };

  const handleHold = () => {
    Swal.fire({
      icon: "success",
      title: "Project has been on hold",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "rgb(0, 208, 255)",
      color: "#000000",
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    onHold();
    onClose(); // Close pop-up
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-20 relative">
        <button
          className="absolute top-2 right-2 text-black text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Project Details</h2>
        <h1 className="text-lg font-semibold text-center mb-2">{title}</h1>
        <p className="text-sm text-center text-gray-700 mb-4">{duration}</p>
        <div className="flex flex-col items-center gap-4">
          <button
            className="bg-curawedaColor text-white font-semibold w-full py-2 rounded-full hover:bg-[#029FCC]"
            onClick={handleDetail}
          >
            Detail
          </button>
          <button
            className="bg-[#148B84] text-white font-semibold w-full py-2 rounded-full hover:bg-[#106B66]"
            onClick={handleHold}
          >
            Hold
          </button>
        </div>
      </div>
    </div>
  );
};


// --- ProjectCard Component (unchanged) ---
interface ProjectCardProps {
  id: string;
  title: string;
  duration: string;
  phase?: string; // For Upcoming
  endDateStatus: string;
  endDateColor: string;
  members: string[];
  reason?: string; // For On Hold
  progress?: number; // For In Progress
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  onCardClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  duration,
  phase,
  endDateStatus,
  endDateColor,
  members,
  reason,
  progress,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const isSelected = selectedProjects.includes(id);

  let progressColor = "#F44336";
  if (progress && progress >= 80) {
    progressColor = "#4CAF50";
  } else if (progress && progress >= 50) {
    progressColor = "#FFEB3B";
  }

  return (
    <div
      className={`card w-72 lg:w-96 bg-white shadow-md rounded-lg p-6 border mx-2 transform transition hover:scale-105 hover:shadow-2xl relative ${
        isSelected ? "border-2 border-[#FF0000]" : ""
      }`}
      onClick={onCardClick}
    >
      {isRemoveMode && (
        <input
          type="checkbox"
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-[#FF0000]"
          checked={isSelected}
          onChange={() => onProjectSelect(id)}
          style={{
            backgroundColor: isSelected ? "red" : "transparent",
          }}
        />
      )}
      <p className="text-lg text-black mb-2 text-center">{duration}</p>
      <h2 className="font-bold text-2xl mb-1 text-center">{title}</h2>
      {phase && <p className="text-md text-black mb-4 text-center">{phase}</p>}
      {reason && (
        <p className="text-xl text-black mb-3 text-left">
          <span className="font-bold">Reason for Hold:</span> {reason}
        </p>
      )}
      {progress !== undefined && (
        <div className="mb-4">
          <span className="font-bold text-black">Progress</span>
          <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="absolute top-0 left-0 h-3 rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
            ></div>
          </div>
          <span className="block text-right font-bold text-black mt-1">
            {progress}%
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex">
          {members.map((member, index) => (
            <img
              key={index}
              src={member}
              alt="member"
              className="w-10 h-10 rounded-full -ml-2 border-2 border-white"
            />
          ))}
          <div
            className="flex items-center justify-center w-10 h-10 bg-gray-300 text-white rounded-full ml-2 cursor-pointer"
            style={{ backgroundColor: endDateColor }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/addTeamProject", { state: { members } });
            }}
          >
            +
          </div>
        </div>
        <div
          className="text-white font-bold rounded-full px-4 py-2"
          style={{ backgroundColor: endDateColor }}
        >
          {endDateStatus}
        </div>
      </div>
    </div>
  );
};

// --- Revised Child Components ---
// Now these components simply receive projects via props rather than fetching internally.

interface ProjectsSectionProps {
  projects: Project[];
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  sectionTitle: string;
}

const InProgress: React.FC<ProjectsSectionProps> = ({
  projects,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  sectionTitle,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/task");
    setSelectedProject(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-left">{sectionTitle}</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => {
              if (!isRemoveMode) setSelectedProject(project);
            }}
            className="cursor-pointer"
          >
            <ProjectCard
              id={project.id?.toString() || ""}
              title={project.title}
              duration={`${new Date(project.start_date).toLocaleDateString()} - ${new Date(
                project.end_date
              ).toLocaleDateString()}`}
              endDateStatus={"Status Proyek"}
              endDateColor={"#FF0000"}
              members={[]}
              isRemoveMode={isRemoveMode}
              onProjectSelect={onProjectSelect}
              selectedProjects={selectedProjects}
              onCardClick={() => {
                if (!isRemoveMode) setSelectedProject(project);
              }}
            />
          </div>
        ))}
      </div>

      {!isRemoveMode && selectedProject && (
        <Popup
          title={selectedProject.title}
          duration={`${new Date(selectedProject.start_date).toLocaleDateString()} - ${new Date(
            selectedProject.end_date
          ).toLocaleDateString()}`}
          onClose={() => setSelectedProject(null)}
          onDetail={handleDetail}
          onHold={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

const UpcomingProjects: React.FC<ProjectsSectionProps> = (props) => {
  // Reuse InProgress layout with a different section title.
  return <InProgress {...props} sectionTitle="Upcoming" />;
};

const OnHold: React.FC<ProjectsSectionProps> = (props) => {
  return <InProgress {...props} sectionTitle="On Hold" />;
};

export { InProgress, UpcomingProjects, OnHold };

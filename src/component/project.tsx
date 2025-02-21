import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Project } from "../component/api/projectApi"; // Pastikan path sesuai

// ------------------------------------
// Helper: Hitung sisa waktu (time left) berdasarkan tanggal akhir
// ------------------------------------
function getTimeLeft(endDate: Date): { label: string; color: string } {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    return { label: "Overdue", color: "#B20000" };
  } else if (days < 7) {
    return { label: `${days} days left`, color: "#F44336" };
  } else if (days < 30) {
    const weeks = Math.ceil(days / 7);
    return { label: `${weeks} weeks left`, color: "#029FCC" };
  } else {
    const months = Math.ceil(days / 30);
    return { label: `${months} months left`, color: "#148B84" };
  }
}

// ------------------------------------
// Popup Component (Detail Popup)
// ------------------------------------
interface PopupProps {
  title: string;
  duration: string;
  clientName: string;
  contractNumber: string;
  noErd: string;
  description: string; // Definition of project
  currentStatus: string;
  onClose: () => void;
  onSetInProgress: () => void;
}

const Popup: React.FC<PopupProps> = ({
  title,
  duration,
  clientName,
  contractNumber,
  noErd,
  description,
  currentStatus,
  onClose,
  onSetInProgress,
}) => {
  const navigate = useNavigate();
  const isInProgress = currentStatus.toLowerCase().includes("in progress");

  const handleDetail = () => {
    navigate("/task");
    onClose();
  };

  const handleSetInProgress = () => {
    onSetInProgress();
    Swal.fire({
      icon: "success",
      title: "Project is now In Progress",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "rgb(0, 208, 255)",
      color: "#000000",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-black text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-4xl font-bold text-center mb-6">Project Details</h2>
        <p className="text-center font-bold text-3xl mb-4">Status: {currentStatus}</p>
        <h1 className="text-2xl font-semibold text-center mb-2">{title}</h1>
        <p className="text-xl text-center text-gray-700 mb-6">{duration}</p>

        <div className="text-gray-700 text-lg space-y-3 mb-6">
          <p>
            <strong>Contract Number:</strong> {contractNumber}
          </p>
          <p>
            <strong>No ERD:</strong> {noErd}
          </p>
          <p>
            <strong>Definition of Project:</strong> {description}
          </p>
          <p>
            <strong>Client Name:</strong> {clientName}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {isInProgress ? (
            <button
              className="bg-curawedaColor text-white font-semibold w-full py-3 rounded-full hover:bg-[#029FCC] text-xl"
              onClick={handleDetail}
            >
              Detail
            </button>
          ) : (
            <button
              className="bg-curawedaColor text-white font-semibold w-full py-3 rounded-full hover:bg-[#029FCC] text-xl"
              onClick={handleSetInProgress}
            >
              In Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------
// ProjectCard Component
// ------------------------------------
interface ProjectCardProps {
  id: string;
  title: string;
  duration: string; // Contoh: "DD/MM/YYYY - DD/MM/YYYY"
  endDate: Date; // untuk hitung sisa waktu
  clientName: string;
  description: string; // Definition of project
  status: string;
  progress?: number;
  // members dihilangkan karena belum terpakai
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  onCardClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  duration,
  endDate,
  clientName,
  description,
  status,
  progress,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const isSelected = selectedProjects.includes(id);
  const { label: timeLeftLabel, color: timeLeftColor } = getTimeLeft(endDate);

  let progressColor = "#F44336";
  if (progress && progress >= 80) {
    progressColor = "#4CAF50";
  } else if (progress && progress >= 50) {
    progressColor = "#FFEB3B";
  }

  return (
    <div
      className={`w-72 h-72 bg-white shadow-md rounded-lg p-4 border mx-2 transform transition hover:scale-105 hover:shadow-2xl relative ${
        isSelected ? "border-2 border-red-500" : "border-gray-200"
      }`}
      onClick={onCardClick}
    >
      {isRemoveMode && (
        <input
          type="checkbox"
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-red-500"
          checked={isSelected}
          onChange={() => onProjectSelect(id)}
          style={{ backgroundColor: isSelected ? "red" : "transparent" }}
        />
      )}

      <div className="h-full flex flex-col justify-between">
        {/* Konten utama dengan padding bawah untuk memberi ruang bagi bottom row */}
        <div className="pb-10">
          <p className="text-lg text-gray-500 mb-1 text-center truncate">{duration}</p>
          <h2 className="font-bold text-2xl mb-1 text-center truncate">{title}</h2>
          {status.toLowerCase().includes("in progress") ? (
            <p className="text-base text-center text-gray-700 mb-2 truncate">
              <strong>Client:</strong> {clientName}
            </p>
          ) : (
            <div className="mb-2">
              {/* Untuk Upcoming, gunakan line-clamp untuk membatasi baris jika tersedia */}
              <p className="text-base text-gray-700 text-center line-clamp-3">
                {description}
              </p>
            </div>
          )}
          {/* Untuk In Progress, letakkan progress bar sedikit lebih ke bawah */}
          {status.toLowerCase().includes("in progress") && progress !== undefined && (
            <div className="mt-10 mb-1">
              <p className="font-bold text-base text-black">Progress</p>
              <div className="relative w-full bg-gray-200 rounded-full h-3 mt-1">
                <div
                  className="absolute top-0 left-0 h-2 rounded-full"
                  style={{ width: `${progress}%`, backgroundColor: progressColor }}
                ></div>
              </div>
              <span className="block text-right text-xs font-bold text-black mt-1">
                {progress}%
              </span>
            </div>
          )}
        </div>
        {/* Bottom row: tombol "+" dan sisa waktu */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div
            className="flex items-center justify-center w-8 h-8 bg-gray-300 text-white rounded-full cursor-pointer"
            style={{ backgroundColor: timeLeftColor }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/addTeamProject", { state: { projectId: id } });
            }}
          >
            +
          </div>
          <div
            className="text-white font-bold rounded-full px-3 py-1 text-sm"
            style={{ backgroundColor: timeLeftColor }}
          >
            {timeLeftLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------
// Section Components: Hanya InProgress dan UpcomingProjects
// ------------------------------------
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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-left">{sectionTitle}</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => {
          const startStr = new Date(project.start_date).toLocaleDateString();
          const endStr = new Date(project.end_date).toLocaleDateString();
          const duration = `${startStr} - ${endStr}`;
          return (
            <div
              key={project.id}
              className="cursor-pointer"
              onClick={() => {
                if (!isRemoveMode) setSelectedProject(project);
              }}
            >
              <ProjectCard
                id={String(project.id)}
                title={project.title}
                duration={duration}
                endDate={new Date(project.end_date)}
                clientName={project.client || ""}
                description={project.description || ""}
                status={project.status}
                progress={project.progress ?? 0}
                isRemoveMode={isRemoveMode}
                onProjectSelect={onProjectSelect}
                selectedProjects={selectedProjects}
                onCardClick={() => {
                  if (!isRemoveMode) setSelectedProject(project);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Popup Detail untuk In Progress: hanya tombol Detail */}
      {!isRemoveMode && selectedProject && (
        <Popup
          title={selectedProject.title}
          duration={`${new Date(selectedProject.start_date).toLocaleDateString()} - ${new Date(
            selectedProject.end_date
          ).toLocaleDateString()}`}
          clientName={selectedProject.client || ""}
          contractNumber={selectedProject.contract_number || ""}
          noErd={selectedProject.erd_number || ""}
          description={selectedProject.description || ""}
          currentStatus={selectedProject.status}
          onClose={() => setSelectedProject(null)}
          onSetInProgress={handleDetail}
        />
      )}
    </div>
  );
};

const UpcomingProjects: React.FC<ProjectsSectionProps> = ({
  projects,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  sectionTitle,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSetInProgress = () => {
    Swal.fire({
      icon: "success",
      title: "Project is now In Progress",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "rgb(0, 208, 255)",
      color: "#000000",
    });
    setSelectedProject(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-left">{sectionTitle}</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => {
          const startStr = new Date(project.start_date).toLocaleDateString();
          const endStr = new Date(project.end_date).toLocaleDateString();
          const duration = `${startStr} - ${endStr}`;
          return (
            <div
              key={project.id}
              className="cursor-pointer"
              onClick={() => {
                if (!isRemoveMode) setSelectedProject(project);
              }}
            >
              <ProjectCard
                id={String(project.id)}
                title={project.title}
                duration={duration}
                endDate={new Date(project.end_date)}
                clientName={""} // Tidak tampil di card Upcoming
                description={project.description || ""}
                status={project.status}
                progress={0} // Upcoming tidak memiliki progress
                isRemoveMode={isRemoveMode}
                onProjectSelect={onProjectSelect}
                selectedProjects={selectedProjects}
                onCardClick={() => {
                  if (!isRemoveMode) setSelectedProject(project);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Popup Detail untuk Upcoming: hanya tombol In Progress */}
      {!isRemoveMode && selectedProject && (
        <Popup
          title={selectedProject.title}
          duration={`${new Date(selectedProject.start_date).toLocaleDateString()} - ${new Date(
            selectedProject.end_date
          ).toLocaleDateString()}`}
          clientName={selectedProject.client || ""}
          contractNumber={selectedProject.contract_number || ""}
          noErd={selectedProject.erd_number || ""}
          description={selectedProject.description || ""}
          currentStatus={selectedProject.status}
          onClose={() => setSelectedProject(null)}
          onSetInProgress={handleSetInProgress}
        />
      )}
    </div>
  );
};

export { InProgress, UpcomingProjects };

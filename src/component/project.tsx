import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import projectApi, { Project } from "../component/api/projectApi";

// ------------------------------------
// Helper: Berdasarkan duration (days), hasilkan label dan warna
// ------------------------------------
function getDurationLabelAndColor(duration: number): { label: string; color: string } {
  if (duration <= 0) {
    return { label: "Overdue", color: "#B20000" }; // merah
  } else if (duration < 7) {
    return { label: `${duration} days left`, color: "#FF9900" }; // kuning
  } else if (duration < 30) {
    const weeks = Math.ceil(duration / 7);
    return { label: `${weeks} weeks left`, color: "#029FCC" }; // biru
  } else {
    const months = Math.ceil(duration / 30);
    return { label: `${months} months left`, color: "#0AB239" }; // hijau
  }
}

// ------------------------------------
// Popup Component (Detail Popup)
// ------------------------------------
interface PopupProps {
  id: string;
  title: string;
  duration: number;
  client: string;
  contract_number: string;
  erd_number: string;
  description: string;
  currentStatus: string;
  onClose: () => void;
  onSetInProgress: () => void;
  refreshProjects: () => void;
}

const Popup: React.FC<PopupProps> = ({
  id,
  title,
  duration,
  client,
  contract_number,
  erd_number,
  description,
  currentStatus,
  onClose,
  onSetInProgress,
  refreshProjects,
}) => {
  const navigate = useNavigate();
  const isInProgress = currentStatus.toLowerCase().includes("in progress");

  // State untuk mengontrol apakah popup edit muncul
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Simpan data project secara lokal
  const [projectDetails, setProjectDetails] = useState({
    title,
    description,
    client,
    contract_number,
    erd_number,
    currentStatus,
    duration,
  });

  // Format duration sebagai "X days"
  const localDuration = `${projectDetails.duration} days`;

  // Callback update dari PopupEdit
  const handleProjectUpdate = (updatedProject: Project) => {
    setProjectDetails({
      title: updatedProject.title,
      description: updatedProject.description,
      client: updatedProject.client || "",
      contract_number: updatedProject.contract_number || "",
      erd_number: updatedProject.erd_number || "",
      currentStatus: updatedProject.status,
      duration: updatedProject.duration,
    });
  };

  const handleDetail = () => {
    navigate(`/project/${id}/task`, {
      state: {
        projectName: projectDetails.title,
        pm: "Gustavo Bergson",
        duration: localDuration,
        client: projectDetails.client,
      },
    });
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
        <p className="text-center font-bold text-3xl mb-4">
          Status: {projectDetails.currentStatus}
        </p>
        <h1 className="text-2xl font-semibold text-center mb-2 whitespace-normal break-words">
          {projectDetails.title}
        </h1>
        <p className="text-xl text-center text-gray-700 mb-6">
          {localDuration}
        </p>

        <div className="text-gray-700 text-lg space-y-3 mb-6">
          <p>
            <strong>Contract Number:</strong> {projectDetails.contract_number}
          </p>
          <p>
            <strong>No PRD:</strong> {projectDetails.erd_number}
          </p>
          <p>
            <strong>Definition of Project:</strong>
            <div className="mt-1 max-h-32 overflow-y-auto">
              {projectDetails.description}
            </div>
          </p>
          <p>
            <strong>Client Name:</strong> {projectDetails.client}
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
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold w-full py-3 rounded-full text-xl"
            onClick={() => setIsEditOpen(true)}
          >
            Edit
          </button>
        </div>

        {isEditOpen && (
          <PopupEdit
            project={{
              id: Number(id),
              title: projectDetails.title,
              description: projectDetails.description,
              client: projectDetails.client,
              contract_number: projectDetails.contract_number,
              erd_number: projectDetails.erd_number,
              status: projectDetails.currentStatus,
              duration: projectDetails.duration,
            }}
            onClose={() => setIsEditOpen(false)}
            refreshProjects={refreshProjects}
            onProjectUpdate={handleProjectUpdate}
          />
        )}
      </div>
    </div>
  );
};

// ------------------------------------
// PopupEdit Component (Edit Project)
// ------------------------------------
interface PopupEditProps {
  project: Project;
  onClose: () => void;
  refreshProjects: () => void;
  onProjectUpdate: (updatedProject: Project) => void;
}

export const PopupEdit: React.FC<PopupEditProps> = ({
  project,
  onClose,
  refreshProjects,
  onProjectUpdate,
}) => {
  const [projectName, setProjectName] = useState(project.title);
  const [duration, setDuration] = useState(String(project.duration));
  const [contractNumber, setContractNumber] = useState(project.contract_number || "");
  const [erdNumber, setErdNumber] = useState(project.erd_number || "");
  const [client, setClientName] = useState(project.client || "");
  const [description, setDescription] = useState(project.description || "");

  // Sinkronisasi state lokal saat props project berubah
  React.useEffect(() => {
    setProjectName(project.title);
    setDuration(String(project.duration));
    setContractNumber(project.contract_number || "");
    setErdNumber(project.erd_number || "");
    setClientName(project.client || "");
    setDescription(project.description || "");
  }, [project]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectApi.updateProject(Number(project.id), {
        title: projectName,
        duration: Number(duration),
        contract_number: contractNumber,
        erd_number: erdNumber,
        client: client,
        description: description,
      });
      Swal.fire({
        icon: "success",
        title: "Project updated successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
      const updatedProject = await projectApi.getProjectById(Number(project.id));
      onProjectUpdate(updatedProject);
      refreshProjects();
      onClose();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed to update project" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-center mb-4">Edit Project</h3>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block font-semibold mb-2">Project Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Duration (days)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 30"
              className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Contract Number</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">No PRD</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              value={erdNumber}
              onChange={(e) => setErdNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Client Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
              value={client}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Definition of Project</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-curawedaColor hover:bg-[#029FCC] text-white font-bold px-6 py-2 rounded-full w-full"
          >
            Save
          </button>
        </form>
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
  duration: number;
  client: string;
  description: string;
  status: string;
  progress?: number;
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  onCardClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  duration,
  client,
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
  const { label: timeLeftLabel, color: timeLeftColor } = getDurationLabelAndColor(duration);

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
        <div className="pb-10">
          <p className="text-lg text-gray-500 mb-1 text-center truncate">
            {duration} days
          </p>
          <h2 className="font-bold text-2xl mb-1 text-center whitespace-normal break-words">
            {title}
          </h2>
          {status.toLowerCase().includes("in progress") ? (
            <p className="text-base text-center text-gray-700 mb-2">
              <strong>Client:</strong> {client}
            </p>
          ) : (
            <div className="mb-2">
              <p className="text-base text-gray-700 text-center line-clamp-5 whitespace-normal break-words">
                {description}
              </p>
            </div>
          )}
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
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div
            className="flex items-center justify-center w-8 h-8 bg-gray-300 text-white rounded-full cursor-pointer"
            style={{ backgroundColor: timeLeftColor }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${id}/team`);
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
// Section Components: InProgress & UpcomingProjects
// ------------------------------------
interface ProjectsSectionProps {
  projects: Project[];
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  sectionTitle: string;
  refreshProjects: () => void;
}

const InProgress: React.FC<ProjectsSectionProps> = ({
  projects,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  sectionTitle,
  refreshProjects,
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
        {projects.map((project) => (
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
              duration={project.duration}
              client={project.client || ""}
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
        ))}
      </div>

      {!isRemoveMode && selectedProject && (
        <Popup
          id={String(selectedProject.id)}
          title={selectedProject.title}
          duration={selectedProject.duration}
          client={selectedProject.client || ""}
          contract_number={selectedProject.contract_number || ""}
          erd_number={selectedProject.erd_number || ""}
          description={selectedProject.description || ""}
          currentStatus={selectedProject.status}
          onClose={() => setSelectedProject(null)}
          onSetInProgress={handleDetail}
          refreshProjects={refreshProjects}
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
  refreshProjects,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSetInProgress = async () => {
    if (!selectedProject) return;
    try {
      await projectApi.updateProject(Number(selectedProject.id), {
        status: "In Progress",
      });
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
      refreshProjects();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed to update project status" });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-left">{sectionTitle}</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => (
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
              duration={project.duration}
              client={project.client || ""}
              description={project.description || ""}
              status={project.status}
              progress={0}
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
          id={String(selectedProject.id)}
          title={selectedProject.title}
          duration={selectedProject.duration}
          client={selectedProject.client || ""}
          contract_number={selectedProject.contract_number || ""}
          erd_number={selectedProject.erd_number || ""}
          description={selectedProject.description || ""}
          currentStatus={selectedProject.status}
          onClose={() => setSelectedProject(null)}
          onSetInProgress={handleSetInProgress}
          refreshProjects={refreshProjects}
        />
      )}
    </div>
  );
};

export { InProgress, UpcomingProjects };

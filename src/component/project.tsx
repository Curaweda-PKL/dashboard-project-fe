import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Project } from "../component/api/projectApi"; // Pastikan path sesuai


// Komponen Popup untuk InProgress (versi asli)
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
    onClose(); // Tutup pop-up
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

// --- Komponen PopupInProgress ---
// Komponen popup baru yang hanya memiliki tombol "In Progress" untuk memindahkan status
interface PopupInProgressProps {
  title: string;
  duration: string;
  onClose: () => void;
  onInProgress: () => void;
}

const PopupInProgress: React.FC<PopupInProgressProps> = ({
  title,
  duration,
  onClose,
  onInProgress,
}) => {
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
            onClick={onInProgress}
          >
            In Progress
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen ProjectCard (tetap sama)
interface ProjectCardProps {
  id: string;
  title: string;
  duration: string;
  phase?: string; // Optional untuk Upcoming
  endDateStatus: string;
  endDateColor: string;
  members: string[];
  reason?: string; // Optional untuk On Hold
  progress?: number; // Optional untuk In Progress
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

// Komponen InProgress (tetap sama)
const InProgress: React.FC<{
  projects: Project[];
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleDetail = () => {
    console.log("Detail clicked");
  };

  const handleHold = () => {
    console.log("Hold clicked");
  };

  const projects = [
    {
      id: "1",
      title: "TourO Web Development",
      duration: "January 10, 2024 - July 30, 2024",
      phase: "Mr.Lorem",
      progress: 70,
      endDateStatus: "2 Days Left",
      endDateColor: "#B20000",
      members: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
      ],
    },
    {
      id: "2",
      title: "Dashboard Portal",
      duration: "February 12, 2024 - August 12, 2024",
      phase: "Mr.Ipsum",
      progress: 50,
      endDateStatus: "2 Weeks Left",
      endDateColor: "#D68C1E",
      members: [
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
      ],
    },
    {
      id: "3",
      title: "Designing",
      duration: "March 20, 2023 - August 20, 2024",
      phase: "Mr.Jhon",
      progress: 85,
      endDateStatus: "1 Month Left",
      endDateColor: "#148B84",
      members: [
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
      ],
    },
    {
      id: "4",
      title: "Project",
      duration: "July 10, 2024 - July 12, 2025",
      phase: "Mrs.Lorem ipsum lorem ipsum",
      progress: 5,
      endDateStatus: "12 Months Left",
      endDateColor: "#0AB239",
      members: [
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
      ],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-left">In Progress</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            isRemoveMode={isRemoveMode}
            onProjectSelect={onProjectSelect}
            onCardClick={() => {
              if (!isRemoveMode) {
                setSelectedProject(projects.find((p) => p.id === project.id));
              }
            }}
            selectedProjects={selectedProjects}
          />
        ))}
      </div>

      {!isRemoveMode && selectedProject && (
        <Popup
          title={selectedProject.title}
          duration={selectedProject.duration}
          onClose={() => setSelectedProject(null)}
          onDetail={handleDetail}
          onHold={handleHold}
        />
      )}
    </div>
  );
};

// Komponen UpcomingProjects dengan PopupInProgress
const UpcomingProjects: React.FC<{
  projects: Project[];
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projects = [
    {
      id: "1",
      title: "Web Development",
      duration: "July 16, 2024",
      endDateStatus: "5 Days to Start",
      endDateColor: "#4CAF50",
      members: [
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    // Tambahkan proyek lainnya di sini...
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-left">Upcoming</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            isRemoveMode={isRemoveMode}
            onProjectSelect={onProjectSelect}
            selectedProjects={selectedProjects}
            onCardClick={() => {
              if (!isRemoveMode) {
                setSelectedProject(project);
              }
            }}
          />
        ))}
      </div>

      {/* Tampilkan PopupInProgress bila ada proyek yang diklik */}
      {!isRemoveMode && selectedProject && (
        <PopupInProgress
          title={selectedProject.title}
          duration={selectedProject.duration}
          onClose={() => setSelectedProject(null)}
          onInProgress={() => {
            console.log("Memindahkan proyek ke In Progress:", selectedProject);
            // Tampilkan notifikasi sukses di pojok kanan atas
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
            // Implementasikan logika pemindahan status disini (misalnya update state/global store)
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

// Komponen OnHold dengan PopupInProgress
const OnHold: React.FC<{
  projects: Project[];
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projects = [
    {
      id: "1",
      title: "Dashboard Portal",
      duration: "February 12, 2024 - August 12, 2024",
      endDateStatus: "On Hold for 1 Week",
      endDateColor: "#9C27B0",
      members: [
        "https://randomuser.me/api/portraits/men/11.jpg",
        "https://randomuser.me/api/portraits/women/12.jpg",
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    // Tambahkan proyek lainnya di sini...
  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-left">On Hold</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            isRemoveMode={isRemoveMode}
            onProjectSelect={onProjectSelect}
            selectedProjects={selectedProjects}
            onCardClick={() => {
              if (!isRemoveMode) {
                setSelectedProject(project);
              }
            }}
          />
        ))}
      </div>

      {/* Tampilkan PopupInProgress bila ada proyek yang diklik */}
      {!isRemoveMode && selectedProject && (
        <PopupInProgress
          title={selectedProject.title}
          duration={selectedProject.duration}
          onClose={() => setSelectedProject(null)}
          onInProgress={() => {
            console.log("Memindahkan proyek ke In Progress:", selectedProject);
            // Tampilkan notifikasi sukses di pojok kanan atas
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
            // Implementasikan logika pemindahan status disini
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

export { InProgress, UpcomingProjects, OnHold };
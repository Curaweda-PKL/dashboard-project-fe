import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

// Komponen Popup
interface PopupProps {
  title: string;
  duration: string;
  onClose: () => void;
  onDetail: () => void;
  onHold: () => void;
}

const Popup: React.FC<PopupProps> = ({ title, duration, onClose, onDetail, onHold }) => {
  const navigate = useNavigate();  // Initialize navigate

  const handleDetail = () => {
    // Navigate to the Task page when the Detail button is clicked
    navigate("/task");  
    onDetail();  // Optionally keep any existing onDetail logic
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
        <h2 className="text-2xl font-bold text-center mb-4">In Progress</h2>
        <h1 className="text-lg font-semibold text-center mb-2">{title}</h1>
        <p className="text-sm text-center text-gray-700 mb-4">{duration}</p>
        <div className="flex flex-col items-center gap-4">
          <button
            className="bg-[#02CCFF] text-white font-semibold w-full py-2 rounded-full hover:bg-[#02CCFF]"
            onClick={handleDetail}  // Use handleDetail function here
          >
            Detail
          </button>
          <button
            className="bg-[#148B84] text-white font-semibold w-full py-2 rounded-full hover:bg-[#106B66]"
            onClick={onHold}
          >
            Hold
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen ProjectCard
interface ProjectCardProps {
  id: string;
  title: string;
  duration: string;
  phase: string;
  progress: number;
  endDateStatus: string;
  endDateColor: string;
  members: string[];
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  onCardClick: (id: string) => void; // Fungsi untuk klik card
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  duration,
  phase,
  progress,
  endDateStatus,
  endDateColor,
  members,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const isSelected = selectedProjects.includes(id);

  let progressColor = "#F44336"; // Warna merah untuk progress rendah
  if (progress >= 80) {
    progressColor = "#4CAF50"; // Warna hijau untuk progress tinggi
  } else if (progress >= 50) {
    progressColor = "#FFEB3B"; // Warna kuning untuk progress sedang
  }

  return (
    <div
      className={`card w-72 lg:w-96 bg-white shadow-md rounded-lg p-6 border mx-2 transform transition hover:scale-105 hover:shadow-2xl relative ${
        isSelected ? "border-2 border-[#FF0000]" : ""
      }`}
      onClick={() => onCardClick(id)}
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
      <p className="text-md text-black mb-4 text-center">{phase}</p>
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
          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-white rounded-full ml-2 cursor-pointer"
               style={{ backgroundColor: endDateColor }}
               onClick={(e) => {
                e.stopPropagation(); // Mencegah trigger onCardClick
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

// Komponen InProgress
const InProgress: React.FC<{
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleDetail = () => {
    ; // Logika Detail
  };

  const handleHold = () => {
   ; // Logika Hold
  };

  const projects = [
    {
      id: "1",
      title: "TourO Web Development",
      duration: "January 10, 2024 - July 30, 2024",
      phase: "Prototyping",
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
      phase: "Phase - III",
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
      phase: "Testing",
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
      phase: "User Requirement Gathering",
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
            onCardClick={(id) => {
              if (!isRemoveMode) {
                // Hanya buka popup jika mode remove tidak aktif
                setSelectedProject(projects.find((p) => p.id === id));
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

export default InProgress;

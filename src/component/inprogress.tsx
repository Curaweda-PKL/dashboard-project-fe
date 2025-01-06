import React from "react";

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
}) => {
  const isSelected = selectedProjects.includes(id);

  // Mengatur warna progress secara dinamis berdasarkan nilai progress
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
              width: `${progress}%`,        // Progress berdasarkan persen
              backgroundColor: progressColor, // Warna dinamis berdasarkan progress
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
          <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-white rounded-full ml-2">+</div>
        </div>
        <div className="text-white font-bold rounded-full px-4 py-2" style={{ backgroundColor: endDateColor }}>
          {endDateStatus}
        </div>
      </div>
    </div>
  );
};

const InProgress: React.FC<{
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
  const projects = [
    {
      id: "1",
      title: "TourO Web Development",
      duration: "January 10, 2024 - July 30, 2024",
      phase: "Prototyping",
      progress: 70, // Progress yang sedang berjalan
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
        "https://randomuser.me/api/portraits/men/7.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
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
            selectedProjects={selectedProjects}
          />
        ))}
      </div>
    </div>
  );
};

export default InProgress;

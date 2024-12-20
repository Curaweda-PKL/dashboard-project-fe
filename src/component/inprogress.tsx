import React from "react";

// ProjectCard Component
interface ProjectCardProps {
  title: string;
  duration: string;
  phase: string;
  progress: number;
  endDateStatus: string;
  endDateColor: string;
  members: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  duration,
  phase,
  progress,
  endDateStatus,
  endDateColor,
  members,
}) => (
  <div className="card w-72 lg:w-96 bg-white shadow-md rounded-lg p-6 border mx-2 transform transition hover:scale-105 hover:shadow-2xl">
    {/* Duration */}
    <p className="text-lg text-black mb-2 text-center">{duration}</p>

    {/* Title */}
    <h2 className="font-bold text-2xl mb-1 text-center">{title}</h2>

    {/* Phase */}
    <p className="text-md text-black mb-4 text-center">{phase}</p>

    {/* Progress */}
    <div className="mb-4">
      <span className="font-bold text-black">Progress</span>
      <div className="relative w-full bg-gray-200 rounded-full h-3 mt-2">
        <div
          className="absolute top-0 left-0 h-3 rounded-full"
          style={{
            width: `${progress}%`, // Correct template string for width
            backgroundColor: endDateColor, // Progress bar sesuai warna badge
          }}
        ></div>
      </div>
      <span className="block text-right font-bold text-black mt-1">
        {progress}%
      </span>
    </div>

    {/* Members and Status */}
    <div className="flex items-center justify-between">
      {/* Members */}
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
          className="flex items-center justify-center w-10 h-10 bg-gray-300 text-white rounded-full ml-2"
        >
          +
        </div>
      </div>

      {/* End Date Status */}
      <div
        className="text-white font-bold rounded-full px-4 py-2"
        style={{ backgroundColor: endDateColor }}
      >
        {endDateStatus}
      </div>
    </div>
  </div>
);

// Main Component
const InProgress = () => {
  const projects = [
    {
      title: "TourO Web Development",
      duration: "January 10, 2024 - July 30, 2024",
      phase: "Prototyping",
      progress: 70,
      endDateStatus: "2 Days Left",
      endDateColor: "#E53935", // Red
      members: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
      ],
    },
    {
      title: "Dashboard Portal",
      duration: "February 12, 2024 - August 12, 2024",
      phase: "Phase - III",
      progress: 50,
      endDateStatus: "2 Weeks Left",
      endDateColor: "#FB8C00", // Orange
      members: [
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
      ],
    },
    {
      title: "Designing",
      duration: "March 20, 2023 - August 20, 2024",
      phase: "Testing",
      progress: 85,
      endDateStatus: "1 Month Left",
      endDateColor: "#26A69A", // Teal
      members: [
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
      ],
    },
    {
      title: "Project",
      duration: "July 10, 2024 - July 12, 2025",
      phase: "User Requirement Gathering",
      progress: 5,
      endDateStatus: "12 Months Left",
      endDateColor: "#43A047", // Green
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
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default InProgress;

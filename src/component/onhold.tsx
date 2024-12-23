import React from "react";

// ProjectCard Component
interface ProjectCardProps {
  title: string;
  duration: string;
  endDateStatus: string;
  endDateColor: string;
  members: string[];
  reason: string; // Reason prop
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  duration,
  endDateStatus,
  endDateColor,
  members,
  reason, // Destructure reason prop
}) => (
  <div className="card w-full sm:w-72 lg:w-96 bg-white shadow-md rounded-lg p-6 border mx-2 transform transition hover:scale-105 hover:shadow-2xl">
    {/* Duration */}
    <p className="text-lg text-black mb-3 text-center">{duration}</p>

    {/* Title */}
    <h2 className="font-bold text-2xl mb-3 text-center">{title}</h2>

    {/* Reason for Hold */}
    <p className="text-xl text-black mb-3 text-left">
      <span className="font-bold">Reason for Hold:</span> {reason}
    </p>

    {/* Members and Status */}
    <div className="flex items-center justify-between">
      {/* Members */}
      <div className="flex">
        {members.slice(0, 2).map((member, index) => (
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
const Onhold = () => {
  const projects = [
    {
      title: "TourO Web Development",
      duration: "January 10, 2024 - July 30,2024",
      endDateStatus: "On Hold For 5 Days",
      endDateColor: "#E53935", // Red
      members: [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", // Reason for hold
    },
    {
      title: "Dashboard Portal",
      duration: "February 12, 2024 - August 12,2024 ",
      endDateStatus: "On Hold For 1 Weeks",
      endDateColor: "#FB8C00", // Orange
      members: [
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
        
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", // Reason for hold
    },

  ];

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-left">On Hold</h1>
      <div className="flex flex-wrap justify-start">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Onhold ;
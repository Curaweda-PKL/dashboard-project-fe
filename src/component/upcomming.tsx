import React from "react";
import Swal from "sweetalert2";

interface ProjectCardProps {
  id: string;
  title: string;
  duration: string;
  endDateStatus: string;
  endDateColor: string;
  members: string[];
  reason: string;
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
  onCardClick: () => void; // Add this prop
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  duration,
  endDateStatus,
  endDateColor,
  members,
  reason,
  isRemoveMode,
  onProjectSelect,
  selectedProjects,
  onCardClick, // Receive onCardClick as a prop
}) => {
  const isSelected = selectedProjects.includes(id);

  return (
    <div
      onClick={onCardClick} // Call the onCardClick function when the card is clicked
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
      <p className="text-xl text-black mb-3 text-left">
        <span className="font-bold">Definition of Project: </span>{reason}
      </p>
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

const UpcomingProjects: React.FC<{
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
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
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "2",
      title: "Dashboard Portal",
      duration: "July 30, 2024",
      endDateStatus: "1 Week to Start",
      endDateColor: "#00BCD4",
      members: [
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "3",
      title: "Designing",
      duration: "August 10, 2024",
      endDateStatus: "1 Month to Start",
      endDateColor: "#FF5722",
      members: [
        "https://randomuser.me/api/portraits/men/7.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "4",
      title: "Project",
      duration: "July 10, 2024",
      endDateStatus: "2 Months to Start",
      endDateColor: "#673AB7",
      members: [
        "https://randomuser.me/api/portraits/men/9.jpg",
        "https://randomuser.me/api/portraits/women/10.jpg",
      ],
      reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  const handleCardClick = (_id: string, title: string, duration: string) => {
    if (!isRemoveMode) {
      Swal.fire({
        title: `<span style="font-size: 24px; font-weight: bold; color: #000000;">"${title}"</span>`,
        html: `
          <p style="font-size: 18px; color: #000000;"><span color: #000000;">${duration}</span>.</p>
          <button
            style="font-size: 24px; position: absolute; top: 10px; right: 10px; border: none; background: transparent; color: #000000; cursor: pointer;"
            onclick="Swal.close()"
          >
            ✕
          </button>
        `,
        icon: "warning",
        confirmButtonColor: "#02CCFF",
        confirmButtonText: '<span class="text-white font-bold w-full py-2 rounded-full">In Progress</span>',
        customClass: {
          confirmButton: 'swal-custom-button',
        },
        didOpen: () => {
          const closeButton = document.querySelector('button[onclick="Swal.close()"]');
          if (closeButton) {
            closeButton.addEventListener('click', () => {
              Swal.close();
            });
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });

          Toast.fire({
            icon: "success",
            title: "Project Now In Progress",
            background: "rgb(0, 208, 255)", // Blue background color
            color: "#000000", // Black text color
          });
        }
      });
    }
  };

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
            onCardClick={() => handleCardClick(project.id, project.title, project.duration)} // Pass the click handler
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingProjects;

import React from "react";
import { useNavigate } from "react-router-dom";
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
}) => {
  const navigate = useNavigate();
  const isSelected = selectedProjects.includes(id);

  const handleCardClick = () => {
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
        confirmButtonColor: "#09abca",
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

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click event
    onProjectSelect(id);
  };

  return (
    <div
      onClick={handleCardClick} // Trigger popup only if not in remove mode
      className={`card w-72 lg:w-96 bg-white shadow-md rounded-lg p-6 border mx-2 transform transition hover:scale-105 hover:shadow-2xl relative cursor-pointer ${
        isSelected ? "border-2 border-[#FF0000]" : ""
      }`}
    >
      {isRemoveMode && (
        <input
          type="checkbox"
          className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-[#FF0000]"
          checked={isSelected}
          onClick={handleCheckboxChange} // Prevent popup from showing
          style={{
            backgroundColor: isSelected ? "red" : "transparent",
          }}
        />
      )}
      <p className="text-lg text-black mb-2 text-center">{duration}</p>
      <h2 className="font-bold text-2xl mb-1 text-center">{title}</h2>
      <p className="text-xl text-black mb-3 text-left">
        <span className="font-bold">Reason for Hold:</span> {reason}
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

const Onhold: React.FC<{
  isRemoveMode: boolean;
  onProjectSelect: (id: string) => void;
  selectedProjects: string[];
}> = ({ isRemoveMode, onProjectSelect, selectedProjects }) => {
  const projects = [
    {
      id: "1",
      title: "Web Development",
      duration: "January 10, 2024 - July 30, 2024",
      endDateStatus: "On Hold for 5 Days",
      endDateColor: "#F44336",
      members: [
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
      ],
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: "2",
      title: "Dashboard Portal",
      duration: "February 12, 2024 - August 12, 2024",
      endDateStatus: "On Hold for 1 Week",
      endDateColor: "#9C27B0",
      members: [
        "https://randomuser.me/api/portraits/men/11.jpg",
        "https://randomuser.me/api/portraits/women/12.jpg",
      ],
      reason:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
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
          />
        ))}
      </div>
    </div>
  );
};

export default Onhold;

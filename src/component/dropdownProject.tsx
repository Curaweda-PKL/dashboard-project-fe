import React, { useState } from "react";

interface ProjectDropdownProps {
  roles: string[]; // List of projects
  onSubmit: (selectedProject: string) => void; // Callback when submit is clicked
  onClose: () => void; // Callback to close the dropdown
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({ roles, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [selectedProject, setSelectedProject] = useState<string>(""); // State for selected project

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-72">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Project</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search Project"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-full py-2 pl-8 pr-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-white"
        />
        <span className="absolute left-2 top-2.5 text-gray-400">
          🔍
        </span>
      </div>

      {/* Roles List */}
      <div className="h-32 overflow-y-auto">
        {filteredRoles.map((role) => (
          <div
            key={role}
            onClick={() => setSelectedProject(role)}
            className={`py-2 text-center cursor-pointer border-b ${
              selectedProject === role
                ? "font-bold text-black"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {role}
          </div>
        ))}
      </div>

      {/* Remove Submit Button */}
    </div>
  );
};

export default ProjectDropdown;

import React, { useState } from "react";

interface RoleDropdownProps {
  roles: string[]; // List of roles
  onSubmit: (selectedRoles: string) => void; // Callback when submit is clicked
  onClose: () => void; // Callback to close the dropdown
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ roles, onSubmit, onClose }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Handle selecting/deselecting a role
  const toggleRoleSelection = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="fixed top-1/5 right-1/3 transform -translate-x-1/3 -translate-y-1/5 bg-white p-6 rounded-lg shadow-lg w-72 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">Edit Role</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2"
        >
          &times;
        </button>
      </div>

      {/* Roles List with Checkboxes */}
      <div className="h-32 overflow-y-auto border-b">
        {roles.map((role) => (
          <div
            key={role}
            className="flex items-center py-2 px-4 cursor-pointer border-b text-gray-700 hover:bg-gray-100"
            onClick={() => toggleRoleSelection(role)}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                selectedRoles.includes(role) ? "bg-[#02CCFF]" : "bg-[#6D6D6D]"
              }`}
            ></div>
            <span>{role}</span>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            const formattedRoles = selectedRoles.join(", ");
            onSubmit(formattedRoles); // Send selected roles
            onClose(); // Close the dropdown
          }}
          className="bg-curawedaColor text-white font-bold px-4 py-2 rounded-full w-full hover:bg-[#029FCC]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoleDropdown;

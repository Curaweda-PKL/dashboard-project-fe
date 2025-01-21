import React from "react";

interface RoleDropdownProps {
  roles: string[]; // List of roles
  onSubmit: (selectedRole: string) => void; // Callback when submit is clicked
  onClose: () => void; // Callback to close the dropdown
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ roles, onSubmit, onClose }) => {

  return (
    <div className="fixed top-1/5 right-1/3 transform -translate-x-1/3 -translate-y-1/5 bg-white p-6 rounded-lg shadow-lg w-72 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">Edit Role</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2">
          &times;
        </button>
      </div>

      {/* Roles List with Scroll and Bottom Border */}
      <div className="h-32 overflow-y-auto border-b">
        {roles.map((role) => (
          <div
            key={role}
            onClick={() => {
              onSubmit(role); // Trigger onSubmit with the selected role
              onClose(); // Close the dropdown
            }}
            className="py-2 text-center cursor-pointer border-b text-gray-700 hover:bg-gray-100 hover:font-bold"
          >
            {role}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleDropdown;

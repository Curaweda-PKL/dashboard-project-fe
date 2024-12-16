import React, { useState } from "react";

interface StatusDropdownProps {
  statuses: string[]; // List of statuses
  onSubmit: (selectedStatus: string) => void; // Callback when submit is clicked
  onClose: () => void; // Callback to close the dropdown
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ statuses, onSubmit, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State for selected status

  // Filter statuses based on search term
  const filteredStatuses = statuses.filter((status) =>
    status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-72">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Add Status</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg py-2 pl-8 pr-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-white"
        />
        <span className="absolute left-2 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* Status List */}
      <div className="h-32 overflow-y-auto">
        {filteredStatuses.map((status) => (
          <div
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`py-2 text-center cursor-pointer border-b ${
              selectedStatus === status
                ? "font-bold text-black"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {status}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={() => onSubmit(selectedStatus)}
        disabled={!selectedStatus}
        className={`w-full mt-4 py-2 text-white rounded-lg ${
          selectedStatus
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </div>
  );
};

export default StatusDropdown;

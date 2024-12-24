import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ProjectDropdown from "../component/dropdownProject";

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>("");

  const messages = [
    { id: 1, name: "Randy Mango", content: "For the TourO Web Development team", date: "10 Des" },
    { id: 2, name: "Jaydon Press", content: "For the Designing team", date: "10 Jan" },
    { id: 3, name: "Randy Mango", content: "For the TourO Web Development team", date: "19 Apr" },
    { id: 4, name: "Randy Mango", content: "For the TourO Web Development team", date: "10 Apr" },
    { id: 5, name: "Justin Vetrov", content: "For the Dashboard Portal team", date: "29 Jan" },
    { id: 6, name: "Justin Vetrov", content: "For the Dashboard Portal team", date: "2 Feb" },
    { id: 7, name: "Jaydon Press", content: "For the Designing team", date: "17 Jun" },
  ];

  const handleSelectProject = (role: string) => {
    setSelectedProject(role);
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    console.log("Project selected:", selectedProject);
    setIsModalOpen(false);
  };

  const handleOpenMessage = (id: number) => {
    navigate(`/messages/${id}`); // Navigasi ke halaman detail
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-black text-white text-center py-4 rounded-t-lg">
        <h1 className="text-lg font-bold">MESSAGE</h1>
      </div>

      {/* Messages */}
      <div className="bg-white border border-gray-300 rounded-b-lg overflow-hidden">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => handleOpenMessage(message.id)} // Navigasi ke halaman detail
          >
            <div className="flex items-center space-x-4 w-40">
              <h2 className="font-bold text-gray-800">{message.name}</h2>
            </div>
            <div className="flex-1 flex items-center justify-between pl-4 border-b border-gray-200">
              <p className="text-gray-500 truncate">{message.content}</p>
              <div className="text-gray-400">{message.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Message Button */}
      <div className="flex justify-end mt-4">
        <button
          className="flex items-center bg-[#02CCFF] hover:bg-blue-400 text-black font-bold py-2 px-4 rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          Add Message
        </button>
      </div>

      {/* Modal for Adding Message */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] h-[400px] relative">
            {/* Modal Header */}
            <h2 className="text-lg font-bold mb-16 text-center">Add Message</h2>
            {/* Form */}
            <form>
              {/* Select Project */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium mb-1">Select Project</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border border-black rounded-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedProject ? selectedProject : "Select a project"}
                    <RiArrowDropDownLine className="text-gray-400 text-lg" />
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 w-full">
                    <ProjectDropdown
                      roles={["Designing", "Dashboard Portal", "TourO Web Development"]}
                      onSubmit={handleSelectProject}
                      onClose={() => setIsDropdownOpen(false)}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  className="w-full border border-black rounded-full px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter description"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="bg-[#D9D9D9] text-gray-700 font-bold py-2 px-8 rounded-full hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-[#02CCFF] hover:bg-blue-400 text-black font-bold py-2 px-8 rounded-full"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

import { useState } from "react";
import LayoutProject from "../layout/layoutProject";
import UpcomingProjects from "../component/upcomming";
import Onhold from "../component/onhold";
import InProgress from "../component/inprogress";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projectData = [
    { count: 6, label: "In Progress" },
    { count: 8, label: "Upcoming" },
    { count: 2, label: "On Hold" },
    { count: 16, label: "Total Projects" },
  ];

  return (
    <LayoutProject>
      {/* Dashboard Section */}
      <div className="bg-gray-100 shadow-md  rounded-lg p-6 border border-gray-300 mb-8 sticky top-0 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold">Projects</h2>
          <span className="text-black font-bold text-2xl">22 July 2024</span>
        </div>

        {/* Project Summary with Buttons */}
        <div className="flex items-center justify-between">
          {/* Project Data */}
          <div className="grid grid-cols-4 gap-40 mb-4">
            {projectData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start text-start pl-3 border-l-2 border-black"
              >
                <p className="text-2xl font-bold mb-2">{item.count}</p>
                <p className="text-black text-lg font-semibold whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col items-end gap-4 ml-8">
            <button
              className="bg-green-500 text-black font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Add Project
            </button>
            <button className="bg-teal-700 text-black font-bold px-8 py-3 rounded-full hover:scale-105 w-full">
              Remove Project
            </button>
          </div>
        </div>
      </div>

      {/* ProjectList Section */}
      <div className="bg-white shadow-md rounded-lg">
        {/* Removed border-l-2 from this section */}
        <InProgress />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <UpcomingProjects />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <Onhold />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 flex justify-center">
                <h3 className="text-2xl font-bold">Add Project</h3>
              </div>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                  />
                </div>
                <span className="text-lg font-bold">To</span>
                <div>
                  <label className="block font-semibold mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white font-bold px-6 py-2 rounded-full w-full hover:bg-green-600"
              >
                Add Project
              </button>
            </form>
          </div>
        </div>
      )}
    </LayoutProject>
  );
};

export default Dashboard;

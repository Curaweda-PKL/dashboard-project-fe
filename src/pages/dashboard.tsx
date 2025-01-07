import { useState } from "react";
import LayoutProject from "../layout/layoutProject";
import UpcomingProjects from "../component/upcomming";
import Onhold from "../component/onhold";
import InProgress from "../component/inprogress";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<{ [key: string]: string[] }>({
    inProgress: [],
    upcoming: [],
    onHold: [],
  });

  const handleProjectSelect = (section: string, projectId: string) => {
    setSelectedProjects((prev) => ({
      ...prev,
      [section]: prev[section].includes(projectId)
        ? prev[section].filter((id) => id !== projectId)
        : [...prev[section], projectId],
    }));
  };

  const handleRemoveProjects = () => {
    console.log("Removing selected projects:", selectedProjects);
    setSelectedProjects({ inProgress: [], upcoming: [], onHold: [] });
    setIsRemoveMode(false);

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
      title: "Project has been removed",
      background: "rgb(0, 208, 255)", // Warna biru untuk background
      color: "#000000", // Warna teks agar terlihat jelas
    });
  };

  const handleCancelRemove = () => {
    setSelectedProjects({ inProgress: [], upcoming: [], onHold: [] });
    setIsRemoveMode(false);
  };

  const projectData = [
    { count: 6, label: "In Progress" },
    { count: 8, label: "Upcoming" },
    { count: 2, label: "On Hold" },
    { count: 16, label: "Total Projects" },
  ];

  const handleConfirmRemove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#02CCFF",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProjects(); // Hapus project setelah konfirmasi
      }
    });
  };

  return (
    <LayoutProject>
      <div className="bg-gray-100 shadow-md rounded-lg p-6 border border-gray-300 mb-8 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold">Projects</h2>
          <span className="text-black font-bold text-2xl">22 July 2024</span>
        </div>

        <div className="flex items-center justify-between">
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

          <div className="flex flex-col items-end gap-4 ml-8">
            <button
              className="bg-[#02CCFF] hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Add Project
            </button>
            <button
              className="bg-[#FF0000] hover:bg-red-700 text-white  font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
              onClick={() => {
                setIsRemoveMode((prev) => !prev);
                if (isRemoveMode) {
                  handleCancelRemove(); // Reset state when toggling to remove mode
                }
              }}
            >
              {isRemoveMode ? "Cancel" : "Remove Project"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <InProgress
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("inProgress", id)}
          selectedProjects={selectedProjects.inProgress}
        />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <UpcomingProjects
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("upcoming", id)}
          selectedProjects={selectedProjects.upcoming}
        />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <Onhold
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("onHold", id)}
          selectedProjects={selectedProjects.onHold}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Add Project</h3>
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

      {isRemoveMode && (
        <div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
          style={{ transition: "transform 0.3s ease-in-out" }}
        >
          <button
            onClick={handleConfirmRemove}
            className="bg-[#FF0000] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
            style={{ animation: "slideUp 0.5s ease-out" }}
          >
            Remove Project
          </button>
        </div>
      )}
    </LayoutProject>
  );
};

export default Dashboard;

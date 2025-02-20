// src/pages/dashboard.tsx
import { useState, useEffect } from "react";
import LayoutProject from "../layout/layoutProject";
import { InProgress, UpcomingProjects, OnHold } from "../component/project";
import Swal from "sweetalert2";
import projectApi, { Project } from "../component/api/projectApi";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<{ [key: string]: string[] }>({
    inProgress: [],
    upcoming: [],
    onHold: [],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Ambil data proyek dari backend saat komponen Dashboard dimount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getAllProjects();
        console.log("Data proyek:", data); // Lihat apakah data sesuai ekspektasi
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        Swal.fire({ icon: "error", title: "Failed to fetch projects" });
      }
    };
    fetchProjects();
  }, []);

  // Tampilkan notifikasi login (jika diperlukan)
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      localStorage.removeItem("isLoggedIn");
      Swal.fire({
        icon: "success",
        title: "Login successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handler untuk menambah proyek
  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ambil data dari form (Anda bisa menambahkan state untuk form input)
    const newProjectData = {
      title: "New Project", // Contoh, ganti dengan data dari form
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      description: "Description here",
      status: "upcoming", // Misalnya default status adalah upcoming
      pic_id: 1,
    };

    try {
      await projectApi.createProject(newProjectData);
      Swal.fire({
        icon: "success",
        title: "Project has been added",
        background: "rgb(0, 208, 255)",
        color: "#000000",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setIsModalOpen(false);
      // Setelah menambah proyek, refresh data
      const data = await projectApi.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Failed to add project" });
    }
  };

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
    Swal.fire({
      icon: "success",
      title: "Project has been removed",
      background: "rgb(0, 208, 255)",
      color: "#000000",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const handleCancelRemove = () => {
    setSelectedProjects({ inProgress: [], upcoming: [], onHold: [] });
    setIsRemoveMode(false);
  };

  const projectData = [
    {
      count: projects.filter(
        (p) =>
          p.status.toLowerCase() === "in progress" ||
          p.status.toLowerCase() === "in-progress"
      ).length,
      label: "In Progress",
    },
    {
      count: projects.filter((p) => p.status.toLowerCase() === "upcoming").length,
      label: "Upcoming",
    },
    {
      count: projects.filter(
        (p) =>
          p.status.toLowerCase() === "on hold" ||
          p.status.toLowerCase() === "on-hold"
      ).length,
      label: "On Hold",
    },
    { count: projects.length, label: "Total Projects" },
  ];

  // Filter proyek berdasarkan status
  const inProgressProjects = projects.filter(
    (p) =>
      p.status.toLowerCase() === "in progress" ||
      p.status.toLowerCase() === "in-progress"
  );
  const upcomingProjects = projects.filter(
    (p) => p.status.toLowerCase() === "upcoming"
  );
  const onHoldProjects = projects.filter(
    (p) =>
      p.status.toLowerCase() === "on hold" ||
      p.status.toLowerCase() === "on-hold"
  );

  const handleConfirmRemove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09abca",
      cancelButtonColor: "#6D6D6D",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProjects();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {projectData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start text-start pl-3 border-l-2 border-black"
              >
                <p className="text-3xl font-bold mb-2">{item.count}</p>
                <p className="text-black text-[20px] font-semibold whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end gap-4 ml-8">
            <button
              className="bg-curawedaColor hover:bg-[#029FCC] text-white font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Add Project
            </button>
            <button
              className="bg-[#B20000] hover:bg-red-900 text-white font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
              onClick={() => {
                setIsRemoveMode((prev) => !prev);
                if (isRemoveMode) {
                  handleCancelRemove();
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
          projects={inProgressProjects}
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("inProgress", id)}
          selectedProjects={selectedProjects.inProgress}
          sectionTitle="In Progress"  // Added required prop
        />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <UpcomingProjects
          projects={upcomingProjects}
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("upcoming", id)}
          selectedProjects={selectedProjects.upcoming}
          sectionTitle="Upcoming"  // Added required prop
        />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <OnHold
          projects={onHoldProjects}
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("onHold", id)}
          selectedProjects={selectedProjects.onHold}
          sectionTitle="On Hold"  // Added required prop
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex flex-col items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-center">Add Project</h3>
              <button
                className="text-gray-600 hover:text-gray-900 self-end"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleAddProjectSubmit}>
              <div>
                <label className="block font-semibold mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Periode</label>
                <div className="relative">
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-white border rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    <span className={`${startDate && endDate ? "text-black" : "text-gray-500"}`}>
                      {startDate && endDate
                        ? `${startDate} to ${endDate}`
                        : "Select Periode"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg p-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          className="w-1/2 px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                          placeholder="Start Date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="font-semibold">to</span>
                        <input
                          type="date"
                          className="w-1/2 px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                          placeholder="End Date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <button
                        className="mt-4 bg-curawedaColor hover:bg-[#029FCC] text-white font-bold px-4 py-2 rounded-full w-full"
                        onClick={() => setIsDropdownOpen(false)}
                        type="button"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Contract Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">No ERD</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Client Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-curawedaColor hover:bg-[#029FCC] text-white font-bold px-6 py-2 rounded-full w-full"
              >
                Submit
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
            className="bg-[#B20000] hover:bg-red-900 text-white font-bold px-8 py-3 rounded-full hover:scale-105 w-full"
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
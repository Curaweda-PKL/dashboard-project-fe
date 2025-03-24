import { useState, useEffect } from "react";
import LayoutProject from "../layout/layoutProject";
import { InProgress, UpcomingProjects } from "../component/project";
import Swal from "sweetalert2";
import projectApi, { Project } from "../component/api/projectApi";
import teamApi, { TeamMember } from "../component/api/TeamProjectApi";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<{ [key: string]: string[] }>({
    inProgress: [],
    upcoming: [],
  });

  // State form input
  const [projectName, setProjectName] = useState("");
  const [duration, setDuration] = useState(""); // input berupa string, nantinya dikonversi ke number
  const [contract_number, setContractNumber] = useState("");
  const [erd_number, setNoErd] = useState("");
  const [client, setClientName] = useState("");
  const [description, setDescription] = useState("");

  // State untuk dropdown PM (dinamis dari teamApi)
  const [selectedPic, setSelectedPic] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fungsi untuk refresh data proyek dari API
  const refreshProjects = async () => {
    try {
      const data = await projectApi.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to refresh projects", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectApi.getAllProjects();
        setProjects(data);
      } catch (error) {
        Swal.fire({ icon: "error", title: "Failed to fetch projects" });
      }
    };
    fetchProjects();
  }, []);

  // Ambil data team members untuk dropdown PM
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data = await teamApi.getAllTeams();
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching team members", error);
      }
    };
    fetchTeamMembers();
  }, []);

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

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProjectData = {
      title: projectName,
      duration: Number(duration), // konversi input ke number (jumlah hari)
      contract_number: contract_number,
      erd_number: erd_number,
      client: client,
      description: description,
      status: "upcoming", // default status
      // Jika tidak memilih PM, kirimkan pic_id sebagai null
      pic_id: selectedPic ? Number(selectedPic) : null,
      progress: 0, // default progress
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
      setProjectName("");
      setDuration("");
      setContractNumber("");
      setNoErd("");
      setClientName("");
      setDescription("");
      setSelectedPic("");
      await refreshProjects();
    } catch (error) {
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

  const handleRemoveProjects = async () => {
    try {
      const inProgressDeletions = selectedProjects.inProgress.map((id) =>
        projectApi.deleteProject(Number(id))
      );
      const upcomingDeletions = selectedProjects.upcoming.map((id) =>
        projectApi.deleteProject(Number(id))
      );
      const results = await Promise.allSettled([...inProgressDeletions, ...upcomingDeletions]);
      const hasError = results.some((result) => result.status === "rejected");
      if (hasError) {
        throw new Error("One or more deletions failed.");
      }
      setSelectedProjects({ inProgress: [], upcoming: [] });
      setIsRemoveMode(false);

      Swal.fire({
        icon: "success",
        title: "Project has been removed",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });

      await refreshProjects();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Failed to remove project" });
    }
  };

  const handleCancelRemove = () => {
    setSelectedProjects({ inProgress: [], upcoming: [] });
    setIsRemoveMode(false);
  };

  const projectData = [
    {
      count: projects.filter((p) =>
        p.status.toLowerCase() === "in progress" ||
        p.status.toLowerCase() === "in-progress"
      ).length,
      label: "In Progress",
    },
    {
      count: projects.filter((p) => p.status.toLowerCase() === "upcoming").length,
      label: "Upcoming",
    },
    { count: projects.length, label: "Total Projects" },
  ];

  const inProgressProjects = projects.filter((p) =>
    p.status.toLowerCase() === "in progress" ||
    p.status.toLowerCase() === "in-progress"
  );
  const upcomingProjects = projects.filter(
    (p) => p.status.toLowerCase() === "upcoming"
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
          <h2 className="text-4xl font-semibold">Projects</h2>
          <span className="text-black font-semibold text-2xl">{formatDate(new Date())}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {projectData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start text-start pl-3 border-l-2 border-black"
              >
                <p className="text-3xl font-semibold mb-2">{item.count}</p>
                <p className="text-black text-[20px] whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end gap-4 ml-8">
            <button
              className="bg-curawedaColor hover:bg-[#029FCC] text-white font-semibold px-8 py-3 rounded-full hover:scale-105 w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Add Project
            </button>
            <button
              className="bg-[#B20000] hover:bg-red-900 text-white font-semibold px-8 py-3 rounded-full hover:scale-105 w-full"
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
          sectionTitle="In Progress"
          refreshProjects={refreshProjects}
        />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <UpcomingProjects
          projects={upcomingProjects}
          isRemoveMode={isRemoveMode}
          onProjectSelect={(id) => handleProjectSelect("upcoming", id)}
          selectedProjects={selectedProjects.upcoming}
          sectionTitle="Upcoming"
          refreshProjects={refreshProjects}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-center">Add Project</h3>
              <button
                className="text-gray-600 hover:text-gray-900 self-end"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleAddProjectSubmit}>
              <div>
                <label className="block mb-2">Project Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Duration (days)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 30"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Contract Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={contract_number}
                  onChange={(e) => setContractNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2">No PRD</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={erd_number}
                  onChange={(e) => setNoErd(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2">Client Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={client}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              {/* Dropdown PM menggunakan data dari teamApi */}
              <div>
                <label className="block mb-2">PM</label>
                <select
                  value={selectedPic}
                  onChange={(e) => setSelectedPic(e.target.value)}
                  className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="">Select PM</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Definition of Project</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-curawedaColor hover:bg-[#029FCC] text-white font-semibold px-6 py-2 rounded-full w-full"
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
            className="bg-[#B20000] hover:bg-red-900 text-white font-semibold px-8 py-3 rounded-full hover:scale-105 w-full"
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

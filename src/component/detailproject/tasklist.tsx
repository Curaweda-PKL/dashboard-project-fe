import React, { useState, useEffect } from "react";
import HeaderDetail from "./headerdetail";
import Swal from "sweetalert2";
import projectTaskApi from "../api/projectTaskApi";
import { useParams, useLocation } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import projectApi from "../api/projectApi";
import teamApi from "../api/TeamApi";

// Definisi tipe sesuai backend
export interface TaskDetail {
  id?: number;
  module: string;
  feature: string;
  start_date: Date;
  end_date: Date;
  status: string;
}

export interface ProjectTask {
  id?: number;
  project_id?: number;
  created_at?: string;
  updated_at?: string;
  task_details?: TaskDetail[];
  projectName?: string;
  pm?: string;
  date?: string;
  client?: string;
}

// Interface untuk form input "Add Task" dan "Edit Task Detail"
interface MinimalTaskForm {
  module: string;
  feature: string;
  start_date: Date;
  end_date: Date;
  status: string;
}

const TaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // State untuk detail project (tampilan)
  const [projectData, setProjectData] = useState({
    projectName: "Default Project Name",
    pic: "Default PM",
    date: "Default Date",
    client: "Default Client",
  });

  // Ambil data dari route state (jika ada)
  const location = useLocation();
  const routeState = (location.state as {
    projectName?: string;
    pm?: string;
    date?: string;
    client?: string;
  }) || {};

  // Jika ada routeState, update sebagian projectData (kecuali pic akan diupdate dari API)
  useEffect(() => {
    if (routeState && routeState.projectName) {
      setProjectData(prev => ({
        ...prev,
        projectName: routeState.projectName ?? prev.projectName,
        date: routeState.date ?? prev.date,
        client: routeState.client ?? prev.client,
      }));
    }
  }, [routeState]);

  // UseEffect untuk mengambil project detail dan team members untuk mendapatkan PIC
  useEffect(() => {
    if (!projectId) return;
    const fetchProjectData = async () => {
      try {
        // Mengambil data project
        const projectDetails = await projectApi.getProjectById(Number(projectId));
        // Mengambil seluruh team untuk menemukan PIC berdasarkan pic_id
        const teams = await teamApi.getAllTeams();
        const picMember = teams.find(member => member.id === projectDetails.pic_id);
        const picName = picMember ? picMember.name : "Unknown";
        // Format tanggal untuk display
        const formattedDate = `${new Date(projectDetails.start_date).toLocaleDateString()} - ${new Date(
          projectDetails.end_date
        ).toLocaleDateString()}`;
        // Update projectData, gabungkan dengan routeState jika ada
        setProjectData({
          projectName: routeState.projectName ?? projectDetails.title ?? "Default Project Name",
          pic: picName,
          date: routeState.date ?? formattedDate,
          client: routeState.client ?? projectDetails.client ?? "Default Client",
        });
      } catch (err) {
        console.error("Error fetching project data", err);
      }
    };
    fetchProjectData();
  }, [projectId, routeState]);

  // State tasks dan modal
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedDetailIds, setSelectedDetailIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<MinimalTaskForm>({
    module: "",
    feature: "",
    start_date: new Date(),
    end_date: new Date(),
    status: "PENDING",
  });
  const [editDetail, setEditDetail] = useState<
    (MinimalTaskForm & { id: number; projectName: string }) | null
  >(null);

  // Fetch tasks dari API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await projectTaskApi.getAllProjectTasks(Number(projectId));
        console.log("Fetched tasks:", data);
        if (Array.isArray(data)) {
          setTasks(data);
          // Jika routeState tidak ada dan data task tersedia, ambil data project dari task pertama
          if (!routeState?.projectName && data.length > 0) {
            const firstTask = data[0];
            setProjectData(prev => ({
              ...prev,
              projectName: firstTask.projectName ?? prev.projectName,
              // Properti pic tidak diupdate di sini agar tetap konsisten dari API project dan team
              date: firstTask.date ?? prev.date,
              client: firstTask.client ?? prev.client,
            }));
          }
        } else {
          console.error("Data fetched is not an array:", data);
          setTasks([]);
        }
      } catch (error: any) {
        console.error("Failed to fetch tasks:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load tasks",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };
    fetchTasks();
  }, [routeState, projectId]);

  // Toggle mode editing (untuk hapus)
  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedDetailIds([]);
  };

  const handleCheckboxChange = (detailId: number) => {
    setSelectedDetailIds((prev) =>
      prev.includes(detailId)
        ? prev.filter((id) => id !== detailId)
        : [...prev, detailId]
    );
  };

  const handleRemoveSelectedDetails = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09ABCA",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("Selected detail IDs for removal:", selectedDetailIds);
          for (const detailId of selectedDetailIds) {
            await projectTaskApi.deleteTaskDetail(Number(projectId), detailId);
          }
          const refreshedData = await projectTaskApi.getAllProjectTasks(Number(projectId));
          setTasks(refreshedData);
          setSelectedDetailIds([]);
          setIsEditing(false);
          Swal.fire({
            icon: "success",
            title: "Task has been removed",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "rgb(0, 208, 255)",
            color: "#000000",
          });
        } catch (error) {
          console.error("Error deleting task details:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to delete selected task details",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    });
  };

  const openEditModal = (detail: TaskDetail) => {
    if (!detail.id) {
      Swal.fire({
        icon: "error",
        title: "Task detail ID is missing.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    setEditDetail({
      ...detail,
      id: detail.id!,
      projectName: projectData.projectName,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTaskDetail = async () => {
    if (!editDetail) return;
    try {
      const detailId = editDetail.id;
      await projectTaskApi.updateTaskDetail(Number(projectId), detailId, editDetail);
      const refreshedData = await projectTaskApi.getAllProjectTasks(Number(projectId));
      setTasks(refreshedData);
      setIsEditModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Task has been changed",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
    } catch (error) {
      console.error("Error updating task detail:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update task detail",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleAddTask = async () => {
    try {
      const payloadForApi = {
        taskDetails: [
          {
            module: newTask.module,
            feature: newTask.feature,
            start_date: newTask.start_date,
            end_date: newTask.end_date,
            status: newTask.status || "PENDING",
          },
        ],
      };
      await projectTaskApi.createProjectTask(payloadForApi, Number(projectId));
      const refreshedData = await projectTaskApi.getAllProjectTasks(Number(projectId));
      setTasks(refreshedData);
      Swal.fire({
        icon: "success",
        title: "Task has been added",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
      setNewTask({
        module: "",
        feature: "",
        start_date: new Date(),
        end_date: new Date(),
        status: "Pending",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add task",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="p-4">
      <HeaderDetail />
      <div className="mb-6 text-black font-bold">
        <p>
          <strong>Project :</strong> {projectData.projectName}
        </p>
        <p>
          <strong>PIC :</strong> {projectData.pic}
        </p>
        <p>
          <strong>Date :</strong> {projectData.date}
        </p>
        <p>
          <strong>Client :</strong> {projectData.client}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="text-center w-full rounded-lg overflow-hidden border">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              {isEditing && <th className="p-4"></th>}
              <th className="p-4 border-b">MODULE</th>
              <th className="p-4 border-b">FEATURE</th>
              <th className="p-4 border-b">START DATE</th>
              <th className="p-4 border-b">END DATE</th>
              <th className="p-4 border-b">STATUS</th>
              <th className="p-4 border-b"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task, taskIndex) => {
              if (!task.task_details || task.task_details.length === 0) {
                return (
                  <tr key={`no-detail-${taskIndex}`}>
                    <td colSpan={isEditing ? 7 : 6}>No details found</td>
                  </tr>
                );
              }
              return task.task_details.map((detail, detailIndex) => (
                <tr
                  key={`task-${taskIndex}-detail-${detailIndex}`}
                  className="border-t text-black font-bold hover:bg-gray-100 transition duration-200"
                >
                  {isEditing && (
                    <td className="p-4">
                      <label className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedDetailIds.includes(detail.id!)}
                          onChange={() => handleCheckboxChange(detail.id!)}
                          className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                        />
                      </label>
                    </td>
                  )}
                  <td className="p-4">{detail.module || "-"}</td>
                  <td className="p-4">{detail.feature || "-"}</td>
                  <td className="p-4">{detail.start_date ? new Date(detail.start_date).toLocaleDateString() : "-"}</td>
                  <td className="p-4">{detail.end_date ? new Date(detail.end_date).toLocaleDateString() : "-"}</td>
                  <td className="p-4">{detail.status || "-"}</td>
                  <td className="p-4">
                    <button
                      onClick={() => openEditModal(detail)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit Task Detail"
                    >
                      <FaPencilAlt />
                    </button>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      
      {/* Fixed container untuk tombol "Add Task" dan "Remove" */}
      <div className="fixed bottom-10 right-10 flex gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-curawedaColor text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-[#029FCC] transition duration-200"
        >
          Add task
        </button>
        {!isEditing ? (
          <button
            className="bg-[#B20000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-900 transition duration-200"
            onClick={toggleEditingMode}
          >
            Remove
          </button>
        ) : (
          <>
            <button
              className="bg-[#6D6D6D] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-[#494949] transition duration-200"
              onClick={toggleEditingMode}
            >
              Cancel
            </button>
            <button
              className="bg-[#B20000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-900 transition duration-200"
              onClick={handleRemoveSelectedDetails}
            >
              Remove
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">
              Add Task
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={newTask.module}
                  onChange={(e) =>
                    setNewTask({ ...newTask, module: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectData.projectName}
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-200"
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Feature
                </label>
                <input
                  type="text"
                  value={newTask.feature}
                  onChange={(e) =>
                    setNewTask({ ...newTask, feature: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newTask.start_date ? new Date(newTask.start_date).toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, start_date: new Date(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newTask.end_date ? new Date(newTask.end_date).toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, end_date: new Date(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value="PENDING"
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-200"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#6D6D6D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#494949]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditDetail(null);
              }}
            >
              ✕
            </button>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">
              Edit Task Detail
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleUpdateTaskDetail();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={editDetail.module}
                  onChange={(e) =>
                    setEditDetail({ ...editDetail, module: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectData.projectName}
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-200"
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Feature
                </label>
                <input
                  type="text"
                  value={editDetail.feature}
                  onChange={(e) =>
                    setEditDetail({ ...editDetail, feature: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editDetail.start_date ? new Date(editDetail.start_date).toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    setEditDetail({ ...editDetail, start_date: new Date(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={editDetail.end_date ? new Date(editDetail.end_date).toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    setEditDetail({ ...editDetail, end_date: new Date(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value="PENDING"
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-200"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditDetail(null);
                  }}
                  className="bg-[#6D6D6D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#494949]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

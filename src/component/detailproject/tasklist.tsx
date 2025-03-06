import React, { useState, useEffect } from "react";
import HeaderDetail from "./headerdetail";
import Swal from "sweetalert2";
import projectTaskApi from "../api/projectTaskApi"; // <--- import API
import { useParams, useLocation } from "react-router-dom";

// Struktur data "Task" di-extend agar sesuai dengan data dari backend.
// Di backend, setiap "projectTask" punya "task_details" array, berisi
// (module, weight, feature, task, percentage, status, dll).
interface TaskDetail {
  module: string;
  weight: number;
  feature: string;
  task: string;
  percentage: number;
  status: string;
}

interface ProjectTask {
  id?: number;
  project_id?: number;
  created_at?: string;
  updated_at?: string;

  // Field dari backend (snake_case) untuk menampung detail
  task_details?: TaskDetail[];
  
  // (Opsional) Jika Anda ada field lain di root-level projectTask, bisa ditambah di sini
  projectName?: string;
  pm?: string;
  date?: string;
  client?: string;
}

// Interface untuk menampung data form "Add Task"
interface MinimalTaskForm {
  module: string;
  weight: number;
  feature: string;
  task: string;
  percentage: number;
  status: string;
}

const TaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // State untuk detail project (hanya tampilan)
  const [projectData, setProjectData] = useState({
    projectName: "Default Project Name",
    pm: "Default PM",
    date: "Default Date",
    client: "Default Client",
  });

  // Ambil data dari route state jika tersedia
  const location = useLocation();
  const routeState = (location.state as {
    projectName?: string;
    pm?: string;
    date?: string;
    client?: string;
  }) || {};

  // Jika ada data dari route state, perbarui projectData
  useEffect(() => {
    if (routeState && routeState.projectName) {
      setProjectData({
        projectName: routeState.projectName,
        pm: routeState.pm || "Default PM",
        date: routeState.date || "Default Date",
        client: routeState.client || "Default Client",
      });
    }
  }, [routeState]);

  // State untuk menampung tasks (sesuai struktur backend)
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  // State untuk mengatur mode hapus
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  // State modal "Add Task"
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // State form input "Add Task"
  const [newTask, setNewTask] = useState<MinimalTaskForm>({
    module: "",
    weight: 0,
    feature: "",
    task: "",
    percentage: 0,
    status: "Pending",
  });

  // --- Fetch Data dari API ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Panggil API untuk ambil data tasks
        const data = await projectTaskApi.getAllProjectTasks(Number(projectId));
        console.log("Fetched tasks:", data);

        // 'data' diharapkan array of ProjectTask
        if (Array.isArray(data)) {
          setTasks(data);

          // Jika routeState tidak ada, kita bisa ambil data dari task pertama
          // (ini hanya contoh menampilkan nama project, PM, dsb.)
          if (!routeState?.projectName && data.length > 0) {
            const firstTask = data[0];
            setProjectData({
              projectName: firstTask.projectName || "Default Project Name",
              pm: firstTask.pm || "Default PM",
              date: firstTask.date || "Default Date",
              client: firstTask.client || "Default Client",
            });
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

  // Fungsi untuk toggle mode hapus
  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedTasks([]);
  };

  // Fungsi untuk hapus task (lokal)
  // (Jika Anda ingin hapus ke backend, panggil projectTaskApi.deleteProjectTask)
  const handleRemoveTask = async () => {
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
          // Misal: hapus setiap task yang dipilih
          for (const index of selectedTasks) {
            const taskToDelete = tasks[index];
            if (taskToDelete?.id) {
              await projectTaskApi.deleteProjectTask(
                Number(taskToDelete.project_id),
                taskToDelete.id
              );
            }
          }
          // Setelah operasi delete selesai, lakukan re-fetch data
          const refreshedData = await projectTaskApi.getAllProjectTasks(Number(projectId));
          setTasks(refreshedData);
          setSelectedTasks([]);
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
          console.error("Error deleting task:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to delete task",
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
  

  // Fungsi checkbox
  const handleCheckboxChange = (index: number) => {
    setSelectedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Fungsi untuk menambahkan task (mengirim ke backend)
  const handleAddTask = async () => {
    try {
      const payloadForApi = {
        taskDetails: [
          {
            module: newTask.module,
            feature: newTask.feature,
            task: newTask.task,
            weight: newTask.weight,
            percentage: newTask.percentage,
            status: newTask.status || "Pending",
          },
        ],
      };
  
      await projectTaskApi.createProjectTask(payloadForApi, Number(projectId));
      
      // Langsung re-fetch data
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
  
      // Reset form dan tutup modal
      setNewTask({
        module: "",
        weight: 0,
        feature: "",
        task: "",
        percentage: 0,
        status: "",
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
      {/* Header */}
      <HeaderDetail />

      {/* Info Project */}
      <div className="mb-6 text-black font-bold">
        <p>
          <strong>Project :</strong> {projectData.projectName}
        </p>
        <p>
          <strong>PM :</strong> {projectData.pm}
        </p>
        <p>
          <strong>Date :</strong> {projectData.date}
        </p>
        <p>
          <strong>Client :</strong> {projectData.client}
        </p>
      </div>

      {/* Tabel Task List */}
      <div className="overflow-x-auto">
        <table className="text-center w-full rounded-lg overflow-hidden border">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              {isEditing && <th className="p-4"></th>}
              <th className="p-4 border-b">MODULE</th>
              <th className="p-4 border-b">WEIGHT</th>
              <th className="p-4 border-b">FEATURE</th>
              <th className="p-4 border-b">TASK</th>
              <th className="p-4 border-b">PERCENTAGE</th>
              <th className="p-4 border-b">STATUS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task, taskIndex) => {
              // Ambil detail pertama, jika ada
              if (!task.task_details || task.task_details.length === 0) {
                // Jika ternyata kosong, tampilkan baris placeholder
                return (
                  <tr key={`no-detail-${taskIndex}`}>
                    <td colSpan={6}>No details found</td>
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
                          checked={selectedTasks.includes(detailIndex)}
                          onChange={() => handleCheckboxChange(detailIndex)}
                          className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                        />
                      </label>
                    </td>
                  )}
                  <td className="p-4">{detail?.module || "-"}</td>
                  <td className="p-4">{detail?.weight !== undefined ? detail.weight : "-"}</td>
                  <td className="p-4">{detail?.feature || "-"}</td>
                  <td className="p-4">{detail?.task || "-"}</td>
                  <td className="p-4">{detail?.percentage !== undefined ? detail.percentage : "-"}</td>
                  <td className="p-4">{detail?.status || "-"}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>

        {/* Tombol Add dan Remove */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-500 font-bold transition duration-200"
          >
            Add more task...
          </button>
          <div className="fixed bottom-10 right-10 flex gap-4">
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
                  onClick={handleRemoveTask}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add Task */}
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
              {/* MODULE */}
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

              {/* Project Name (readOnly, dari projectData) */}
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

              {/* WEIGHT */}
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Weight
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.weight}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      weight: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              {/* FEATURE */}
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

              {/* TASK */}
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Task Description
                </label>
                <input
                  type="text"
                  value={newTask.task}
                  onChange={(e) =>
                    setNewTask({ ...newTask, task: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              {/* PERCENTAGE */}
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.percentage}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      percentage: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
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
    </div>
  );
};

export default TaskList;

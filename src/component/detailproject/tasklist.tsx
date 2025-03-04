import React, { useState, useEffect } from "react";
import HeaderDetail from "./headerdetail";
import { FaChevronDown } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import Swal from "sweetalert2";
import projectTaskApi, { Task as ApiTask } from "../api/projectTaskApi";
import { useParams, useLocation } from "react-router-dom";

interface Task extends ApiTask {
  showAssigneesDropdown?: boolean;
  projectName?: string;
  pm?: string;
  date?: string;
  client?: string;
}

// Definisi tipe Task untuk tampilan (bisa di-extend dari API Task)
interface Task extends ApiTask {
  showAssigneesDropdown?: boolean;
}

const TaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // State untuk detail project
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

  // State tasks dan lainnya
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Task>({
    module: "",
    weight: 0,
    totalWeight: 0,
    percent: 0,
    assignees: [],
    deadline: "",
    showAssigneesDropdown: false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // List assignees yang tersedia
  const assigneesList = ["Gustavo Bergson", "Roger Franci", "Wilson Press"];

  // Fungsi untuk menghitung persentase
  const calculatePercentage = (weight: number, totalWeight: number): number => {
    return totalWeight !== 0 ? (weight / totalWeight) * 100 : 0;
  };

  // --- Fetch Data dari API ---  
  // Kami memanggil API satu kali untuk mengambil tasks,
  // dan jika route state tidak ada, kami ambil detail project dari task pertama.
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await projectTaskApi.getAllProjectTasks();
        console.log("Fetched tasks:", data);
        if (Array.isArray(data)) {
          setTasks(data);
          // Jika route state tidak menyediakan detail project dan data task tidak kosong,
          // gunakan task pertama untuk mengupdate projectData.
          if (!routeState?.projectName && data.length > 0) {
            const firstTask = data[0] as Task;
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

  // Fungsi untuk mengaktifkan mode hapus
  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedTasks([]);
  };

  // Fungsi untuk menghapus task yang dipilih (operasi lokal)
  const handleRemoveTask = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09ABCA",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter((_, index) => !selectedTasks.includes(index)));
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
        });
      }
    });
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Fungsi untuk menambahkan task baru (operasi lokal)
  const handleAddTask = async () => {
    try {
      // Panggil API untuk membuat task baru
      const createdTask = await projectTaskApi.createProjectTask(newTask);
      // Perbarui state dengan task yang dikembalikan dari backend
      setTasks((prevTasks) => [...prevTasks, createdTask]);

      Swal.fire({
        icon: "success",
        title: "Task has been added",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset form setelah task ditambahkan
      setNewTask({
        module: "",
        weight: 0,
        totalWeight: 0,
        percent: 0,
        assignees: [],
        deadline: "",
        showAssigneesDropdown: false,
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

  const toggleAssignee = (assignee: string) => {
    setNewTask((prevTask) => {
      const updatedAssignees = prevTask.assignees.includes(assignee)
        ? prevTask.assignees.filter((a) => a !== assignee)
        : [...prevTask.assignees, assignee];
      return { ...prevTask, assignees: updatedAssignees };
    });
  };

  const handleSubmitAssignees = () => {
    setNewTask({ ...newTask, showAssigneesDropdown: false });
  };

  const handleOpenEditModal = (index: number) => {
    setEditTaskIndex(index);
    setEditTask({ ...tasks[index] });
    setIsEditModalOpen(true);
  };

  const toggleEditAssignee = (assignee: string) => {
    if (editTask) {
      const updatedAssignees = editTask.assignees.includes(assignee)
        ? editTask.assignees.filter((a) => a !== assignee)
        : [...editTask.assignees, assignee];
      setEditTask({ ...editTask, assignees: updatedAssignees });
    }
  };

  const handleSaveEdit = () => {
    if (editTaskIndex !== null && editTask !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editTaskIndex] = {
        ...editTask,
        percent: calculatePercentage(editTask.weight, editTask.totalWeight),
      };
      setTasks(updatedTasks);

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
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-4">
      {/* Oper data project ke HeaderDetail */}
      <HeaderDetail/>

      {/* Header Detail yang otomatis mengisi nama project */}
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
              <th className="p-4 border-b">TOTAL WEIGHT</th>
              <th className="p-4 border-b">PERCENTAGE</th>
              <th className="p-4 border-b">ASSIGNEES</th>
              <th className="p-4 border-b">DEADLINE</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="border-t text-black font-bold hover:bg-gray-100 transition duration-200"
              >
                {isEditing && (
                  <td className="p-4">
                    <label className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                      />
                    </label>
                  </td>
                )}
                <td className="p-4">{task.module}</td>
                <td className="p-4">{Number(task.weight).toFixed(2)}</td>
                <td className="p-4">{Number(task.totalWeight).toFixed(2)}</td>
                <td className="p-4">{Number(task.percent).toFixed(2)}%</td>
                <td className="p-4">{task.assignees.join(", ")}</td>
                <td className="p-4 relative">
                  <span className="block text-center">{task.deadline}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(index);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#0AB239] hover:text-[#0AB239]"
                  >
                    <RiPencilFill size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

      {/* Modal untuk menambahkan task baru */}
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
              {/* Field Project Name terisi otomatis dari detail project */}
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
                  Weight
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.weight}
                  onChange={(e) => {
                    const weight = parseFloat(e.target.value);
                    setNewTask({
                      ...newTask,
                      weight,
                      percent: calculatePercentage(weight, newTask.totalWeight),
                    });
                  }}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Total Weight
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.totalWeight}
                  onChange={(e) => {
                    const totalWeight = parseFloat(e.target.value);
                    setNewTask({
                      ...newTask,
                      totalWeight,
                      percent: calculatePercentage(newTask.weight, totalWeight),
                    });
                  }}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.percent.toFixed(2)}
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-200"
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Assignees
                </label>
                <div className="relative">
                  <div
                    className="border rounded-md p-2 bg-white cursor-pointer relative flex justify-between items-center"
                    onClick={() =>
                      setNewTask({
                        ...newTask,
                        showAssigneesDropdown: !newTask.showAssigneesDropdown,
                      })
                    }
                  >
                    <span>
                      {newTask.assignees.length > 0
                        ? newTask.assignees.join(", ")
                        : "Select Assignees"}
                    </span>
                    <FaChevronDown
                      className={`transition duration-200 ${
                        newTask.showAssigneesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {newTask.showAssigneesDropdown && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
                      {assigneesList.map((assignee) => (
                        <label
                          key={assignee}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newTask.assignees.includes(assignee)}
                            onChange={() => toggleAssignee(assignee)}
                            className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                          />
                          {assignee}
                        </label>
                      ))}
                      <div className="p-2 text-center">
                        <button
                          type="button"
                          onClick={handleSubmitAssignees}
                          className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) =>
                    setNewTask({ ...newTask, deadline: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
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

      {/* Modal untuk mengedit task */}
      {isEditModalOpen && editTask !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">
              Edit Task
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={editTask.module}
                  onChange={(e) =>
                    setEditTask({ ...editTask, module: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              {/* Field Project Name (otomatis dan read-only) */}
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
                  Weight
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={Number(editTask.weight).toString()}
                  onChange={(e) => {
                    const weight = parseFloat(e.target.value);
                    setEditTask({
                      ...editTask,
                      weight,
                      percent: calculatePercentage(weight, editTask.totalWeight),
                    });
                  }}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Total Weight
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={Number(editTask.totalWeight).toString()}
                  onChange={(e) => {
                    const totalWeight = parseFloat(e.target.value);
                    setEditTask({
                      ...editTask,
                      totalWeight,
                      percent: calculatePercentage(editTask.weight, totalWeight),
                    });
                  }}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editTask.percent.toFixed(2)}
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-200"
                />
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Assignees
                </label>
                <div className="relative">
                  <div
                    className="border rounded-md p-2 bg-white cursor-pointer relative flex justify-between items-center"
                    onClick={() =>
                      setEditTask(
                        editTask
                          ? {
                              ...editTask,
                              showAssigneesDropdown: !editTask.showAssigneesDropdown,
                            }
                          : null
                      )
                    }
                  >
                    <span>
                      {editTask.assignees.length > 0
                        ? editTask.assignees.join(", ")
                        : "Select Assignees"}
                    </span>
                    <FaChevronDown
                      className={`transition duration-200 ${
                        editTask.showAssigneesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {editTask.showAssigneesDropdown && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
                      {assigneesList.map((assignee) => (
                        <label
                          key={assignee}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={editTask.assignees.includes(assignee)}
                            onChange={() => toggleEditAssignee(assignee)}
                            className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                          />
                          {assignee}
                        </label>
                      ))}
                      <div className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setEditTask(
                              editTask
                                ? { ...editTask, showAssigneesDropdown: false }
                                : null
                            )
                          }
                          className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={editTask.deadline}
                  onChange={(e) =>
                    setEditTask({ ...editTask, deadline: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-[#6D6D6D] text-white font-bold py-2 px-4 rounded-md hover:bg-[#494949]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-curawedaColor text-white font-bold py-2 px-4 rounded-md hover:bg-[#029FCC]"
                >
                  Save Changes
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

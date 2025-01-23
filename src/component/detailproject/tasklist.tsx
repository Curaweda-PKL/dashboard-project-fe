import React, { useState } from "react";
import HeaderDetail from './headerdetail';
import { FaChevronDown } from "react-icons/fa"; // Impor ikon

interface Task {
  module: string;
  weight: number;
  totalWeight: number;
  percent: number;
  assignees: string[];
  deadline: string;
  showAssigneesDropdown?: boolean; // Menambahkan properti untuk mengontrol tampilan dropdown
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      module: "Pembelian",
      weight: 2.0,
      totalWeight: 5.0,
      percent: 75,
      assignees: ["Gustavo Bergson"],
      deadline: "2024-12-10",
    },
    {
      module: "Penjualan",
      weight: 4.0,
      totalWeight: 8.0,
      percent: 15,
      assignees: ["Roger Franci"],
      deadline: "2024-12-12",
    },
    {
      module: "Penerimaan",
      weight: 3.0,
      totalWeight: 7.0,
      percent: 15,
      assignees: ["Anna Smith"],
      deadline: "2024-12-15",
    },
  ]);

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
    showAssigneesDropdown: false, // Reset dropdown state
  });

  const assigneesList = ["Gustavo Bergson", "Roger Franci", "Wilson Press"];

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedTasks([]);
  };

  const handleRemoveTask = () => {
    setTasks(tasks.filter((_, index) => !selectedTasks.includes(index)));
    setSelectedTasks([]);
    setIsEditing(false);
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddTask = () => {
    setTasks([...tasks, newTask]);
    setNewTask({
      module: "",
      weight: 0,
      totalWeight: 0,
      percent: 0,
      assignees: [],
      deadline: "",
      showAssigneesDropdown: false, // Reset dropdown state
    });
    setIsModalOpen(false);
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
    setNewTask({
      ...newTask,
      showAssigneesDropdown: false, // Menutup dropdown setelah submit
    });
  };

  return (
    <div className="">
      <HeaderDetail />

      <div className="mb-6 text-black font-bold">
        <p><strong>Project :</strong> TourO Web Development</p>
        <p><strong>PM :</strong> Gustavo Bergson</p>
        <p><strong>Date :</strong> 12/12/2024</p>
        <p><strong>Client :</strong> Mr.Lorem</p>
      </div>

      <table className="text-center w-full rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#02CCFF] text-white">
            {isEditing && <th className="p-4 border-b-4 border-white"></th>}
            <th className="p-4 rounded-tl-lg border-b-4 border-white">MODULE</th>
            <th className="p-4 border-b-4 border-white">WEIGHT</th>
            <th className="p-4 border-b-4 border-white">TOTAL WEIGHT</th>
            <th className="p-4 border-b-4 border-white">PERCENT</th>
            <th className="p-4 border-b-4 border-white">ASSIGNEES</th>
            <th className="p-4 rounded-tr-lg border-b-4 border-white">DEADLINE</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tasks.map((task, index) => (
            <tr key={index} className="border-t text-center text-black font-bold hover:bg-gray-100 transition duration-200">
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
              <td className="p-4">{task.weight.toFixed(2)}</td>
              <td className="p-4">{task.totalWeight.toFixed(2)}</td>
              <td className="p-4">{task.percent}%</td>
              <td className="p-4">{task.assignees.join(", ")}</td>
              <td className="p-4">{task.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-6">
        <div className="font-bold text-gray-500">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-500 transition duration-200"
          >
            Add more task...
          </button>
        </div>
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

      {/* Medium Pop-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">Add Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-semibold mb-1">Module Name</label>
                <input
                  type="text"
                  value={newTask.module}
                  onChange={(e) => setNewTask({ ...newTask, module: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-lg text-black font-semibold mb-1">Weight</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.weight}
                  onChange={(e) =>
                    setNewTask({ ...newTask, weight: parseFloat(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-lg text-black font-semibold mb-1">Total Weight</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.totalWeight}
                  onChange={(e) =>
                    setNewTask({ ...newTask, totalWeight: parseFloat(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-lg text-black font-semibold mb-1">Percentage</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTask.percent}
                  onChange={(e) =>
                    setNewTask({ ...newTask, percent: parseFloat(e.target.value) })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-lg text-black font-semibold mb-1">Assignees</label>
                <div className="relative">
                  <div
                    className="border rounded-md p-2 bg-white cursor-pointer relative flex justify-between items-center"
                    onClick={() => setNewTask({ ...newTask, showAssigneesDropdown: !newTask.showAssigneesDropdown })}
                  >
                    <span>
                      {newTask.assignees.length > 0
                        ? newTask.assignees.join(", ")
                        : "Select Assignees"}
                    </span>
                    <FaChevronDown
                      className={`transition duration-200 ${newTask.showAssigneesDropdown ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Dropdown */}
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
                      {/* Submit Button */}
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
                <label className="block text-lg text-black font-semibold mb-1">Deadline</label>
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
    </div>
  );
};

export default TaskList;

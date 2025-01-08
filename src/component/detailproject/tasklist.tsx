import React, { useState } from "react";
import HeaderDetail from './headerdetail';

interface Task {
  module: string;
  feature: string;
  task: string;
  weight: number;
  percent: number;
  status: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      module: "Pembelian",
      feature: "Button “Remove”",
      task: "List Pembelian",
      weight: 2.0,
      percent: 75,
      status: "DONE",
    },
    {
      module: "Penjualan",
      feature: "Button “Submit”",
      task: "List Penjualan",
      weight: 4.0,
      percent: 15,
      status: "ON PROGRESS",
    },
    {
      module: "Penerimaan",
      feature: "Button “Login”",
      task: "List Penjualan",
      weight: 3.0,
      percent: 15,
      status: "ON PROGRESS",
    },
  ]);

  const [currentPage, setCurrentPage] = useState<string>("Task");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleRemoveTask = () => {
    // Filter out tasks that are selected
    setTasks(tasks.filter((_, index) => !selectedTasks.includes(index)));
    setSelectedTasks([]); // Clear the selected tasks after removal
    setIsEditing(false); // Exit editing mode after removal
  };

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedTasks([]); // Reset selected tasks when toggling editing mode
  };

  const handleCheckboxChange = (index: number) => {
    // Update selected tasks when checkbox is toggled
    setSelectedTasks((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // Unselect if already selected
        : [...prev, index] // Select if not already selected
    );
  };

  return (
    <div className="p-6">
      <HeaderDetail onClick={handlePageChange} />

      <div className="mb-6 text-black font-bold">
        <p><strong>Project :</strong> TourO Web Development</p>
        <p><strong>PIC :</strong> Gustavo Bergson</p>
        <p><strong>Date :</strong> 12/12/2024</p>
      </div>

      {currentPage === 'Task' && (
        <>
          <table className="text-center w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#02CCFF] text-white">
                {isEditing && <th className="p-4 border-b-4 border-white"></th>}
                <th className="p-4 rounded-tl-lg border-b-4 border-white">MODULE</th>
                <th className="p-4 border-b-4 border-white">FEATURE</th>
                <th className="p-4 border-b-4 border-white">TASK</th>
                <th className="p-4 border-b-4 border-white">WEIGHT</th>
                <th className="p-4 border-b-4 border-white">PERCENT</th>
                <th className="p-4 rounded-tr-lg border-b-4 border-white">STATUS</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className="border-t text-center text-black font-bold hover:bg-gray-100 transition duration-200"
                >
                  {isEditing && (
                    <td className="p-4">
                      <label className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                          className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-[#02CCFF] checked:border-[#02CCFF] transition duration-200 cursor-pointer"
                        />
                      </label>
                    </td>
                  )}
                  <td className="p-4">{task.module}</td>
                  <td className="p-4">{task.feature}</td>
                  <td className="p-4">{task.task}</td>
                  <td className="p-4">{task.weight.toFixed(2)}</td>
                  <td className="p-4">{task.percent}%</td>
                  <td className="p-4">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <div className="font-bold text-gray-500">
              <button>Add more task...</button>
            </div>
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  className="bg-[#FF0000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
                  onClick={toggleEditingMode}
                >
                  Remove
                </button>
              ) : (
                <>
                  <button
                    className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transition duration-200"
                    onClick={toggleEditingMode}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#FF0000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
                    onClick={handleRemoveTask}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {currentPage === 'Timeline' && <div>Timeline content goes here...</div>}
      {currentPage === 'Summary' && <div>Summary content goes here...</div>}
    </div>
  );
};

export default TaskList;

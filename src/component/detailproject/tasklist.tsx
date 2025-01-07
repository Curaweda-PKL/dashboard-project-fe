import React, { useState } from "react";
import HeaderDetail from './headerdetail'; // Pastikan path impor sesuai dengan struktur folder Anda

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
  ]);
  const [currentPage, setCurrentPage] = useState<string>("Task");

  const handleRemoveTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <HeaderDetail onClick={handlePageChange} />

      {/* Project Info */}
      <div className="mb-6 text-black font-bold">
        <p>
          <strong>Project :</strong> TourO Web Development
        </p>
        <p>
          <strong>PIC :</strong> Gustavo Bergson
        </p>
        <p>
          <strong>Date :</strong> 12/12/2024
        </p>
      </div>

      {/* Display content based on the selected page */}
      {currentPage === 'Task' && (
        
        <>
          {/* Task Table */}
          <table className="text-center w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#02CCFF] text-white">
                <th className="p-4">MODULE</th>
                <th className="p-4">FEATURE</th>
                <th className="p-4">TASK</th>
                <th className="p-4">WEIGHT</th>
                <th className="p-4">PERCENT</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className="border-t text-center text-black font-bold hover:bg-gray-100 transition duration-200"
                >
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

          {/* Remove Button */}
          <div className="mt-4 flex justify-end">
            <button
              className="bg-[#FF0000] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-200"
              onClick={() => handleRemoveTask(tasks.length - 1)}
            >
              Remove
            </button>
          </div>

          {/* Add more team button section */}
          <div className="flex justify-start mt-2 space-x-2">
            <div className="font-bold text-gray-500">
              <button>Add more task...</button>
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

import React, { useState } from "react";
import HeaderDetail from "./headerdetail"; // Import the HeaderDetail component

interface Module {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  timeline: string;
  color: string;
}

const Timeline: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([
    { name: "Module 1", startDate: "05/01/2024", endDate: "01/03/2024", status: "ON PROGRESS", timeline: "5 Jan - 1 Mar", color: "bg-[#ECA6A6]" },
    { name: "Module 2", startDate: "02/02/2024", endDate: "14/03/2024", status: "PENDING", timeline: "2 Feb - 14 Mar", color: "bg-[#B20000]" },
    { name: "Module 3", startDate: "25/02/2024", endDate: "20/07/2024", status: "DONE", timeline: "25 Feb - 20 Jul", color: "bg-[#1C148B]" },
    { name: "Module 4", startDate: "21/05/2024", endDate: "25/06/2024", status: "ON PROGRESS", timeline: "21 May - 25 Jun", color: "bg-[#ECA6A6]" },
    { name: "Module 5", startDate: "16/06/2024", endDate: "20/07/2024", status: "PENDING", timeline: "16 Jun - 20 Jul", color: "bg-[#B20000]" },
    { name: "Module 6", startDate: "14/03/2024", endDate: "02/05/2024", status: "ON PROGRESS", timeline: "14 Mar - 2 May", color: "bg-[#ECA6A6]", },
    { name: "Module 7", startDate: "DD/MM/YY", endDate: "DD/MM/YY", status: "PENDING", timeline: "", color: "bg-[#B20000]" },
  ]);

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // Handle status change and update the module state
  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedModules = [...modules];
    updatedModules[index].status = newStatus;

    // Update color based on status
    if (newStatus === "DONE") {
      updatedModules[index].color = "bg-[#1C148B]";
    } else if (newStatus === "ON PROGRESS") {
      updatedModules[index].color = "bg-[#ECA6A6]";
    } else if (newStatus === "PENDING") {
      updatedModules[index].color = "bg-[#B20000]";
    }

    setModules(updatedModules); // Update state
    setOpenDropdownIndex(null); // Close dropdown after selection
  };

  // Render module table
  const renderModuleTable = () => (
    <table className="w-full text-center border-collapse border border-rounded-lg mb-8">
      <thead className="bg-[#02CCFF] text-white">
        <tr>
          <th className="p-4">MODULE</th>
          <th className="p-4">START DATE</th>
          <th className="p-4">END DATE</th>
          <th className="p-4">STATUS</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {modules.map((module, index) => (
          <tr key={index} className="text-black font-bold hover:bg-gray-100 transition duration-200">
            <td className="p-4 border border-black">{module.name}</td>

            {/* Apply separate style to startDate */}
            <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center">
              {module.startDate}
            </td>

            {/* Apply separate style to endDate */}
            <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center">
              {module.endDate}
            </td>

            <td className="p-4 border border-black relative text-center">
              <div className="relative">
                <button
                  className={`rounded-full px-4 py-2 text-white font-bold ${module.color} flex items-center justify-between w-full`}
                  onClick={() =>
                    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
                  }
                >
                  {module.status}
                  <span className="ml-2">&#9662;</span>
                </button>
                {openDropdownIndex === index && (
                  <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-56 p-4 z-10 border border-gray-300">
                    <p className="text-center font-bold mb-4">Edit Status</p>
                    <div className="flex flex-col space-y-2">
                      <button
                        className="py-2 px-4 text-white font-bold bg-[#1C148B] rounded-full hover:bg-opacity-90"
                        onClick={() => handleStatusChange(index, "DONE")}
                      >
                        DONE
                      </button>
                      <button
                        className="py-2 px-4 text-black font-bold bg-[#ECA6A6] rounded-full hover:bg-opacity-90"
                        onClick={() => handleStatusChange(index, "ON PROGRESS")}
                      >
                        ON PROGRESS
                      </button>
                      <button
                        className="py-2 px-4 text-white font-bold bg-[#B20000] rounded-full hover:bg-opacity-90"
                        onClick={() => handleStatusChange(index, "PENDING")}
                      >
                        PENDING
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Render calendar table
  const renderCalendarTable = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const numbers = [1, 2, 3, 4]; // Numbers under each month

    return (
      <table className="w-full text-center border-collapse rounded-lg mb-8">
        <thead className="bg-[#02CCFF] text-white">
          <tr>
            {months.map((month) => (
              <th key={month} className="p-4">{month}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-black font-bold">
          {/* Row for numbers (1, 2, 3, 4) */}
          <tr className="bg-[#D9D9D9]">
            {months.map((_, index) => (
              <td key={index} className="p-4 border border-black">
                <div className="flex justify-between">
                  {numbers.map((num, numIndex) => (
                    <div key={numIndex} className="border border-black px-2">{num}</div>
                  ))}
                </div>
              </td>
            ))}
          </tr>
          {/* Row for module data */}
          {modules.map((_module, index) => (
            <tr key={index}>
              {months.map((_, monthIndex) => (
                <td key={monthIndex} className="p-9 border border-black"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6">
      <HeaderDetail />
      <div className="flex justify-between space-x-8">
        <div className="w-1/2">{renderModuleTable()}</div>
        <div className="w-1/2">{renderCalendarTable()}</div>
      </div>
    </div>
  );
};

export default Timeline;

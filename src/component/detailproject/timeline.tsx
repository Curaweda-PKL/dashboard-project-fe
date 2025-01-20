import React, { useState } from "react";
import HeaderDetail from "./headerdetail"; // Pastikan file ini tersedia

interface Module {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  timeline: string;
  color: string;
  duration: string;
}

const Timeline: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([
    { name: "Module 1", startDate: "05/01/2024", endDate: "01/03/2024", status: "ON PROGRESS", timeline: "5 Jan - 1 Mar", color: "bg-[#ECA6A6]", duration: "57 DAY" },
    { name: "Module 2", startDate: "02/02/2024", endDate: "14/03/2024", status: "PENDING", timeline: "2 Feb - 14 Mar", color: "bg-[#B20000]", duration: "40 DAY" },
    { name: "Module 3", startDate: "25/02/2024", endDate: "20/07/2024", status: "DONE", timeline: "25 Feb - 20 Jul", color: "bg-[#1C148B]", duration: "145 DAY" },
    { name: "Module 4", startDate: "21/05/2024", endDate: "25/06/2024", status: "ON PROGRESS", timeline: "21 May - 25 Jun", color: "bg-[#ECA6A6]", duration: "35 DAY" },
    { name: "Module 5", startDate: "16/06/2024", endDate: "20/07/2024", status: "PENDING", timeline: "16 Jun - 20 Jul", color: "bg-[#B20000]", duration: "34 DAY" },
    { name: "Module 6", startDate: "14/03/2024", endDate: "02/05/2024", status: "ON PROGRESS", timeline: "14 Mar - 2 May", color: "bg-[#ECA6A6]", duration: "49 DAY" },
    { name: "Module 7", startDate: "DD/MM/YY", endDate: "DD/MM/YY", status: "PENDING", timeline: "", color: "bg-[#B20000]", duration: "0 DAY" },
  ]);

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedModules = [...modules];
    updatedModules[index].status = newStatus;

    if (newStatus === "DONE") updatedModules[index].color = "bg-[#1C148B]";
    if (newStatus === "ON PROGRESS") updatedModules[index].color = "bg-[#ECA6A6]";
    if (newStatus === "PENDING") updatedModules[index].color = "bg-[#B20000]";

    setModules(updatedModules);
    setOpenDropdownIndex(null);
  };

  const renderCombinedTable = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const numbers = [1, 2, 3, 4];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-center border-collapse rounded-lg mb-8">
          {/* Header Tabel */}
          <thead className="sticky top-0 bg-[#02CCFF]">
            <tr>
              <th className="p-4 text-white min-w-[200px]">MODULE</th>
              <th className="p-4 text-white min-w-[150px]">START DATE</th>
              <th className="p-4 text-white min-w-[150px]">END DATE</th>
              <th className="p-4 text-white min-w-[150px]">DURATION</th>
              <th className="p-4 text-white min-w-[200px]">STATUS</th>
              {months.map((month) => (
                <th key={month} className="p-4 text-white min-w-[120px]">
                  <div className="flex flex-col items-center">
                    <span>{month}</span>
                    <div className="flex space-x-1 mt-1">
                      {numbers.map((number) => (
                        <span
                          key={number}
                          className="text-black rounded-full w-5 h-5 flex items-center justify-center border border-curawedaColor"
                        >
                          {number}
                        </span>
                      ))}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Tabel */}
          <tbody className="bg-white text-black font-bold">
            {modules.map((module, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="p-4 border border-black min-w-[200px]">{module.name}</td>
                <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">{module.startDate}</td>
                <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">{module.endDate}</td>
                <td className="p-4 border border-black font-bold text-[#6A6A6A] text-center min-w-[150px]">{module.duration}</td>
                <td className="p-4 border border-black relative text-center min-w-[200px]">
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
                            className="py-2 px-4 text-white font-bold bg-[#ECA6A6] rounded-full hover:bg-opacity-90"
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
                {months.map((_, monthIndex) => (
                  <td key={monthIndex} className="p-9 border border-black min-w-[120px]"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <HeaderDetail />
      <div className="w-full">{renderCombinedTable()}</div>
    </div>
  );
};

export default Timeline;

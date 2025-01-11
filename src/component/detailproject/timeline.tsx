import React from "react";
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
  const modules: Module[] = [
    { name: "Module 1", startDate: "05/01/2024", endDate: "01/03/2024", status: "ON PROGRESS", timeline: "5 Jan - 1 Mar", color: "bg-[#ECA6A6]" },
    { name: "Module 2", startDate: "02/02/2024", endDate: "14/03/2024", status: "PENDING", timeline: "2 Feb - 14 Mar", color: "bg-[#B20000]" },
    { name: "Module 3", startDate: "25/02/2024", endDate: "20/07/2024", status: "DONE", timeline: "25 Feb - 20 Jul", color: "bg-[#1C148B]" },
    { name: "Module 4", startDate: "21/05/2024", endDate: "25/06/2024", status: "ON PROGRESS", timeline: "21 May - 25 Jun", color: "bg-[#ECA6A6]" },
    { name: "Module 5", startDate: "16/06/2024", endDate: "20/07/2024", status: "PENDING", timeline: "16 Jun - 20 Jul", color: "bg-[#B20000]" },
    { name: "Module 6", startDate: "14/03/2024", endDate: "02/05/2024", status: "ON PROGRESS", timeline: "14 Mar - 2 May", color: "bg-[#ECA6A6]" },
    { name: "Module 7", startDate: "DD/MM/YY", endDate: "DD/MM/YY", status: "PENDING", timeline: "", color: "bg-[#B20000]" },
  ];

  // Render first table (modules info)
  const renderModuleTable = () => (
    <table className="w-full text-center border-collapse border border-rounded-lg mb-8">
      <thead className="bg-[#02CCFF] text-white">
        <tr>
          <th className="p-4 ">MODULE</th>
          <th className="p-4 ">START DATE</th>
          <th className="p-4 ">END DATE</th>
          <th className="p-4 ">STATUS</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {modules.map((module, index) => (
          <tr key={index} className="text-black font-bold hover:bg-gray-100 transition duration-200">
            <td className="p-4 border border-black">{module.name}</td>
            <td className="p-4 border border-black">{module.startDate}</td>
            <td className="p-4 border border-black">{module.endDate}</td>
            <td className="p-4 border border-black">
              <select
                defaultValue={module.status}
                className={`rounded-full px-4 py-1 text-white text-center font-bold ${module.color}`}
              >
                <option value="ON PROGRESS">ON PROGRESS</option>
                <option value="PENDING">PENDING</option>
                <option value="DONE">DONE</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Render second table (calendar for 12 months with numbers 1, 2, 3, 4 side by side and separated with full borders)
  const renderCalendarTable = () => {
    const numbers = [1, 2, 3, 4]; // Numbers to be displayed under each month

    return (
      <table className="w-full text-center border-collapse rounded-lg mb-8">
        <thead className="bg-[#02CCFF] text-white">
          <tr>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
              <th key={month} className="p-4 ">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((_, index) => (
              <td key={index} className="p-4 border border-black">
                {/* Display numbers 1, 2, 3, 4 horizontally with full borders separating them */}
                <div className="flex justify-between">
                  {numbers.map((num, numIndex) => (
                    <div key={numIndex} className="border-r last:border-r-0 px-2">{num}</div>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6">
      <HeaderDetail />

      <div className="flex justify-between space-x-8">
        {/* First table */}
        <div className="w-1/2">
          {renderModuleTable()}
        </div>

        {/* Second table */}
        <div className="w-1/2">
          {renderCalendarTable()}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

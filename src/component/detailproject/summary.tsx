import React from "react";
import HeaderDetail from "./headerdetail";

const Summary: React.FC = () => {
  const data = [
    {
      no: 1,
      case: "Button Error",
      causes: "Error in program code",
      action: "Correct the wrong program code",
      pic: "Gustavo Bergson",
      deadline: "15/12/2024",
      status: "On Going",
      closeDate: "18/12/2024",
    },
  ];

  return (
    <div className="p-6">
      <HeaderDetail />

      <div className="overflow-x-auto">
        <table className="text-center w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              <th className="p-4 border-b-4">NO</th>
              <th className="p-4 border-b-4">CASE</th>
              <th className="p-4 border-b-4">CAUSES</th>
              <th className="p-4 border-b-4">ACTION</th>
              <th className="p-4 border-b-4">PIC</th>
              <th className="p-4 border-b-4">DEADLINE</th>
              <th className="p-4 border-b-4">STATUS</th>
              <th className="p-4 border-b-4">CLOSE DATE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="text-black text-center font-bold">
                <td className="p-4 border-b-4">{row.no}</td>
                <td className="p-4 border-b-4">{row.case}</td>
                <td className="p-4 border-b-4">{row.causes}</td>
                <td className="p-4 border-b-4">{row.action}</td>
                <td className="p-4 border-b-4">{row.pic}</td>
                <td className="p-4 border-b-4">{row.deadline}</td>
                <td className="p-4 border-b-4">
                  <div className="relative inline-block">
                    <select className="bg-transparent text-black cursor-pointer" defaultValue={row.status}>
                      <option value="Open">Open</option>
                      <option value="On Going">On Going</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </td>
                <td className="p-4 border-b-4">{row.closeDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 font-bold text-gray-500 flex items-center">
         <button>Add more summary...</button>
      </div>
    </div>
  );
};

export default Summary;
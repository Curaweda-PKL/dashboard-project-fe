import React, { useState } from "react";
import HeaderDetail from './headerdetail'; // Pastikan pathnya benar

const Summary: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("Summary");

  const handlePageChange = (page: string) => {
    setCurrentPage(page); // Mengubah halaman yang aktif
  };

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
      {/* Header */}
      <HeaderDetail onClick={handlePageChange} />

      {/* Tampilkan konten berdasarkan halaman yang aktif */}
      {currentPage === "Summary" && (
        <>
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-red-700 text-white text-left">
                  <th className="py-2 px-4 border">NO</th>
                  <th className="py-2 px-4 border">CASE</th>
                  <th className="py-2 px-4 border">CAUSES</th>
                  <th className="py-2 px-4 border">ACTION</th>
                  <th className="py-2 px-4 border">PIC</th>
                  <th className="py-2 px-4 border">DEADLINE</th>
                  <th className="py-2 px-4 border">STATUS</th>
                  <th className="py-2 px-4 border">CLOSE DATE</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="text-black">
                    <td className="py-2 px-4 border">{row.no}</td>
                    <td className="py-2 px-4 border">{row.case}</td>
                    <td className="py-2 px-4 border">{row.causes}</td>
                    <td className="py-2 px-4 border">{row.action}</td>
                    <td className="py-2 px-4 border">{row.pic}</td>
                    <td className="py-2 px-4 border">{row.deadline}</td>
                    <td className="py-2 px-4 border">
                      <div className="relative inline-block">
                        <select
                          className="bg-transparent text-black cursor-pointer"
                          defaultValue={row.status}
                        >
                          <option value="On Going">On Going</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-2 px-4 border">{row.closeDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add More Button */}
          <div className="mt-4 flex items-center">
            <div className="w-8 h-8 bg-red-700 text-white font-bold flex items-center justify-center rounded-full mr-2">
              S
            </div>
            <span className="text-gray-500">Add more summary....</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Summary;

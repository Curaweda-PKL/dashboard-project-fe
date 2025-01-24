import React, { useState } from "react";
import HeaderDetail from "./headerdetail";

const Summary: React.FC = () => {
  const [data, setData] = useState([
    {
      module: "Pembelian",
      case: "Button Error",
      causes: "Error in program code",
      action: "Correct the wrong program code",
      asigness: "Gustavo Bergson",
      deadline: "15/12/2024",
      status: "On Going",
      closeDate: "18/12/2024",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSummary, setNewSummary] = useState({
    module: "",
    case: "",
    causes: "",
    action: "",
    asigness: "",
    deadline: "",
  });

  const handleAddSummary = () => {
    setData([...data, { ...newSummary, status: "Open", closeDate: "" }]);
    setNewSummary({
      module: "",
      case: "",
      causes: "",
      action: "",
      asigness: "",
      deadline: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <HeaderDetail />
      <div className="mb-6 text-black font-bold">
        <p><strong>Project :</strong> TourO Web Development</p>
        <p><strong>PM :</strong> Gustavo Bergson</p>
        <p><strong>Date :</strong> 12/12/2024</p>
        <p><strong>Client :</strong> Mr.Lorem</p>
      </div>

      <div className="overflow-x-auto">
        <table className="text-center w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              <th className="p-4 border-b">MODULE</th>
              <th className="p-4 border-b">CASE</th>
              <th className="p-4 border-b">CAUSES</th>
              <th className="p-4 border-b">ACTION</th>
              <th className="p-4 border-b">ASIGNESS</th>
              <th className="p-4 border-b">DEADLINE</th>
              <th className="p-4 border-b">STATUS</th>
              <th className="p-4 border-b">CLOSE DATE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="text-black text-center font-bold">
                <td className="p-4 border-b">{row.module}</td>
                <td className="p-4 border-b">{row.case}</td>
                <td className="p-4 border-b">{row.causes}</td>
                <td className="p-4 border-b">{row.action}</td>
                <td className="p-4 border-b">{row.asigness}</td>
                <td className="p-4 border-b">{row.deadline}</td>
                <td className="p-4 border-b">
                  <div className="relative inline-block">
                    <select
                      className="bg-transparent text-black cursor-pointer"
                      defaultValue={row.status}
                    >
                      <option value="Open">Open</option>
                      <option value="On Going">On Going</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </td>
                <td className="p-4 border-b">{row.closeDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-500 font-bold transition duration-200"
        >
          Add more summary
        </button>
        </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">Add Summary</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSummary();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-bold mb-1">Module Name</label>
                <input
                  type="text"
                  value={newSummary.module}
                  onChange={(e) => setNewSummary({ ...newSummary, module: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">Case</label>
                <input
                  type="text"
                  value={newSummary.case}
                  onChange={(e) => setNewSummary({ ...newSummary, case: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">Causes</label>
                <input
                  type="text"
                  value={newSummary.causes}
                  onChange={(e) => setNewSummary({ ...newSummary, causes: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">Action</label>
                <input
                  type="text"
                  value={newSummary.action}
                  onChange={(e) => setNewSummary({ ...newSummary, action: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">Asigness</label>
                <input
                  type="text"
                  value={newSummary.asigness}
                  onChange={(e) => setNewSummary({ ...newSummary, asigness: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">Deadline</label>
                <input
                  type="date"
                  value={newSummary.deadline}
                  onChange={(e) => setNewSummary({ ...newSummary, deadline: e.target.value })}
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-curawedaColor text-white px-4 py-2 rounded-md hover:bg-curawedaColor"
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

export default Summary;

import React, { useState } from "react";
import Swal from "sweetalert2";
import HeaderDetail from "./headerdetail";
import { RiPencilFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";

const Summary: React.FC = () => {
  // Initial summary data; ensure the "assignees" property is stored as an array
  const [data, setData] = useState([
    {
      module: "Pembelian",
      case: "Button Error",
      causes: "Error in program code",
      action: "Correct the wrong program code",
      assignees: ["Gustavo Bergson"],
      deadline: "15/12/2024",
      status: "On Going",
      closeDate: "18/12/2024",
    },
  ]);

  // State for the Add Summary modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSummary, setNewSummary] = useState({
    module: "",
    case: "",
    causes: "",
    action: "",
    assignees: [] as string[],
    deadline: "",
    showAssigneesDropdown: false,
  });

  // State for the Edit Summary modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSummary, setEditSummary] = useState({
    module: "",
    case: "",
    causes: "",
    action: "",
    assignees: [] as string[],
    deadline: "",
    showAssigneesDropdown: false,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // State for the summary deletion (editing) mode
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  // Available assignees list
  const assigneesList = ["Gustavo Bergson", "Roger Franci", "Wilson Press"];

  // Toggle function for assignees in the Add Summary modal
  const toggleAssignee = (assignee: string) => {
    setNewSummary((prev) => {
      const newAssignees = [...prev.assignees];
      if (newAssignees.includes(assignee)) {
        return { ...prev, assignees: newAssignees.filter((a) => a !== assignee) };
      } else {
        return { ...prev, assignees: [...newAssignees, assignee] };
      }
    });
  };

  // Toggle function for assignees in the Edit Summary modal
  const toggleEditAssignee = (assignee: string) => {
    setEditSummary((prev) => {
      const newAssignees = [...prev.assignees];
      if (newAssignees.includes(assignee)) {
        return { ...prev, assignees: newAssignees.filter((a) => a !== assignee) };
      } else {
        return { ...prev, assignees: [...newAssignees, assignee] };
      }
    });
  };

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedTasks([]);
  };

  const handleCheckboxChange = (index: number) => {
    if (selectedTasks.includes(index)) {
      setSelectedTasks(selectedTasks.filter((taskIndex) => taskIndex !== index));
    } else {
      setSelectedTasks([...selectedTasks, index]);
    }
  };

  const handleRemoveSelectedTasks = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09ABCA",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = data.filter((_, index) => !selectedTasks.includes(index));
        setData(newData);
        setIsEditing(false);
        setSelectedTasks([]);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Summary has been removed",
          background: "rgb(0, 208, 255)",
          color: "#000000",
        });
      }
    });
  };

  const handleAddSummary = () => {
    setData([...data, { ...newSummary, status: "Open", closeDate: "" }]);
    setNewSummary({
      module: "",
      case: "",
      causes: "",
      action: "",
      assignees: [],
      deadline: "",
      showAssigneesDropdown: false,
    });
    setIsModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Summary has been added",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "rgb(0, 208, 255)",
      color: "#000000",
    });
  };

  const handleOpenEditModal = (index: number) => {
    const summaryToEdit = data[index];
    setEditSummary({
      module: summaryToEdit.module,
      case: summaryToEdit.case,
      causes: summaryToEdit.causes,
      action: summaryToEdit.action,
      assignees: Array.isArray(summaryToEdit.assignees)
        ? summaryToEdit.assignees
        : [summaryToEdit.assignees],
      deadline: summaryToEdit.deadline,
      showAssigneesDropdown: false,
    });
    setEditIndex(index);
    setIsEditModalOpen(true);
  };

  const handleEditSummary = () => {
    if (editIndex !== null) {
      const updatedData = [...data];
      updatedData[editIndex] = {
        ...editSummary,
        status: updatedData[editIndex].status,
        closeDate: updatedData[editIndex].closeDate,
      };
      setData(updatedData);
      setIsEditModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Summary has been changed",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
    }
  };

  return (
    <div>
      <HeaderDetail />
      <div className="mb-6 text-black font-bold">
        <p>
          <strong>Project :</strong> TourO Web Development
        </p>
        <p>
          <strong>PM :</strong> Gustavo Bergson
        </p>
        <p>
          <strong>Date :</strong> 12/12/2024
        </p>
        <p>
          <strong>Client :</strong> Mr. Lorem
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="text-center w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              {isEditing && <th className="p-4"></th>}
              <th className="p-4 border-b">MODULE</th>
              <th className="p-4 border-b">CASE</th>
              <th className="p-4 border-b">CAUSES</th>
              <th className="p-4 border-b">ACTION</th>
              <th className="p-4 border-b">ASSIGNEES</th>
              <th className="p-4 border-b">DEADLINE</th>
              <th className="p-4 border-b">STATUS</th>
              <th className="p-4 border-b">CLOSE DATE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
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
                        className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                      />
                    </label>
                  </td>
                )}
                <td className="p-4 border-b">{row.module}</td>
                <td className="p-4 border-b">{row.case}</td>
                <td className="p-4 border-b">{row.causes}</td>
                <td className="p-4 border-b">{row.action}</td>
                <td className="p-4 border-b">
                  {Array.isArray(row.assignees)
                    ? row.assignees.join(", ")
                    : row.assignees}
                </td>
                <td className="p-4 border-b">{row.deadline}</td>
                <td className="p-4 border-b">
                  <select
                    className="bg-transparent text-black cursor-pointer"
                    defaultValue={row.status}
                  >
                    <option value="Open">Open</option>
                    <option value="On Going">On Going</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                {/* Close Date column with edit button */}
                <td className="p-4 border-b relative">
                  <span>{row.closeDate}</span>
                  <button
                    onClick={() => handleOpenEditModal(index)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#0AB239] hover:text-[#0AB239]"
                  >
                    <RiPencilFill size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              onClick={handleRemoveSelectedTasks}
            >
              Remove
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 text-gray-500 font-bold px-3 rounded-full shadow-lg transition duration-200"
      >
        Add more summary
      </button>

      {/* Modal Add Summary */}
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
              Add Summary
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSummary();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={newSummary.module}
                  onChange={(e) =>
                    setNewSummary({ ...newSummary, module: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Case
                </label>
                <input
                  type="text"
                  value={newSummary.case}
                  onChange={(e) =>
                    setNewSummary({ ...newSummary, case: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Causes
                </label>
                <input
                  type="text"
                  value={newSummary.causes}
                  onChange={(e) =>
                    setNewSummary({ ...newSummary, causes: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Action
                </label>
                <input
                  type="text"
                  value={newSummary.action}
                  onChange={(e) =>
                    setNewSummary({ ...newSummary, action: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              {/* Dropdown for Assignees with submit button */}
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Assignees
                </label>
                <div className="relative">
                  <div
                    className="border rounded-md p-2 bg-white cursor-pointer relative flex justify-between items-center"
                    onClick={() =>
                      setNewSummary({
                        ...newSummary,
                        showAssigneesDropdown: !newSummary.showAssigneesDropdown,
                      })
                    }
                  >
                    <span>
                      {newSummary.assignees.length > 0
                        ? newSummary.assignees.join(", ")
                        : "Select Assignees"}
                    </span>
                    <FaChevronDown
                      className={`transition duration-200 ${
                        newSummary.showAssigneesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {newSummary.showAssigneesDropdown && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
                      {assigneesList.map((assignee) => (
                        <label
                          key={assignee}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newSummary.assignees.includes(assignee)}
                            onChange={() => toggleAssignee(assignee)}
                            className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                          />
                          {assignee}
                        </label>
                      ))}
                      <div className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setNewSummary({
                              ...newSummary,
                              showAssigneesDropdown: false,
                            })
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
                <label className="block text-lg text-black font-bold mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newSummary.deadline}
                  onChange={(e) =>
                    setNewSummary({ ...newSummary, deadline: e.target.value })
                  }
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

      {/* Modal Edit Summary */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] text-black font-semibold p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">
              Edit Summary
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSummary();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Module Name
                </label>
                <input
                  type="text"
                  value={editSummary.module}
                  onChange={(e) =>
                    setEditSummary({ ...editSummary, module: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Case
                </label>
                <input
                  type="text"
                  value={editSummary.case}
                  onChange={(e) =>
                    setEditSummary({ ...editSummary, case: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Causes
                </label>
                <input
                  type="text"
                  value={editSummary.causes}
                  onChange={(e) =>
                    setEditSummary({ ...editSummary, causes: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-lg text-black font-bold mb-1">
                  Action
                </label>
                <input
                  type="text"
                  value={editSummary.action}
                  onChange={(e) =>
                    setEditSummary({ ...editSummary, action: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              {/* Dropdown for Assignees in Edit Summary modal with submit button */}
              <div>
                <label className="block text-lg text-black font-semibold mb-1">
                  Assignees
                </label>
                <div className="relative">
                  <div
                    className="border rounded-md p-2 bg-white cursor-pointer relative flex justify-between items-center"
                    onClick={() =>
                      setEditSummary({
                        ...editSummary,
                        showAssigneesDropdown: !editSummary.showAssigneesDropdown,
                      })
                    }
                  >
                    <span>
                      {editSummary.assignees.length > 0
                        ? editSummary.assignees.join(", ")
                        : "Select Assignees"}
                    </span>
                    <FaChevronDown
                      className={`transition duration-200 ${
                        editSummary.showAssigneesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {editSummary.showAssigneesDropdown && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 z-10">
                      {assigneesList.map((assignee) => (
                        <label
                          key={assignee}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={editSummary.assignees.includes(assignee)}
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
                            setEditSummary({
                              ...editSummary,
                              showAssigneesDropdown: false,
                            })
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
                <label className="block text-lg text-black font-bold mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={editSummary.deadline}
                  onChange={(e) =>
                    setEditSummary({ ...editSummary, deadline: e.target.value })
                  }
                  className="w-full border rounded-md p-2 bg-white"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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

      {/* Status Summary Table */}
      <div className="absolute bottom-0 p-4 text-center">
        <table className="border border-black text-black font-bold">
          <tbody>
            <tr>
              <td className="px-4 py-2 bg-blue-800 text-white font-bold rounded-lg">DONE</td>
              <td className="px-4 py-2 border border-black">170</td>
              <td className="px-4 py-2 border border-black">97,70%</td>
            </tr>
            <tr>
              <td className="px-4 py-2 bg-pink-300 text-white font-bold rounded-lg">ON PROGRESS</td>
              <td className="px-4 py-2 border border-black">3</td>
              <td className="px-4 py-2 border border-black">1,725%</td>
            </tr>
            <tr>
              <td className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg">PENDING</td>
              <td className="px-4 py-2 border border-black">1</td>
              <td className="px-4 py-2 border border-black">0,575%</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">TOTAL</td>
              <td className="px-4 py-2 border border-black font-bold">174</td>
              <td className="px-4 py-2 border border-black font-bold">100,00%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Summary;

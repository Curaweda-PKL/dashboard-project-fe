import { useState } from "react";
import LayoutProject from "../layout/layoutProject";
import { RiArrowDropDownLine } from "react-icons/ri";
import RoleDropdown from "../component/dropdownRole";
import StatusDropdown from "../component/dropdownStatus";

const TeamTable = () => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);

  const handleSubmit = (role: string) => {
    setShowDropdown(false);
    alert(`Role selected: ${role}`);
  };

  const handleStatusSubmit = (status: string) => {
    setShowStatusDropdown(false);
    alert(`Status selected: ${status}`);
  };

  const statuses = ["Incubation", "PKL", "Employee"];

  const handleRemoveClick = () => {
    setShowCheckboxes(true);
  };

  const handleCancelClick = () => {
    setShowCheckboxes(false);
  };

  const teamMembers = [
    { id: 1, name: "Mochammad Faith", role: "FrontEnd Developer", status: "PKL" },
    { id: 2, name: "Kaylynn Baptista", role: "BackEnd Developer", status: "Incubation" },
    { id: 3, name: "Dimas Bintang", role: "FrontEnd Developer", status: "PKL" },
    { id: 4, name: "Sultan Arya", role: "UI/UX Designer", status: "PKL" },
  ];

  return (
    <LayoutProject>
      <div className="p-4 flex flex-col">
        {/* Table */}
        <table className="w-full border-collapse shadow-md">
          <thead>
            <tr className="bg-gray-900 text-white">
              {showCheckboxes && <th className="p-2"></th>}
              <th className="p-2">NAME</th>
              <th className="p-2">ROLE</th>
              <th className="p-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-100">
                {showCheckboxes && (
                  <td className="p-2 text-center">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                )}
                <td className="p-2 text-center">{member.name}</td>
                <td className="p-2 text-center font-semibold">
                  {member.role} <button onClick={() => setShowDropdown(true)}><RiArrowDropDownLine className="inline-block float-right" /></button>
                  {showDropdown && (
                    <RoleDropdown
                      roles={["FrontEnd Developer", "BackEnd Developer", "UI/UX Designer"]}
                      onSubmit={handleSubmit}
                      onClose={() => setShowDropdown(false)}
                    />
                  )}
                </td>
                <td className="p-2 text-center">
                  {member.status} <button onClick={() => setShowStatusDropdown(true)}><RiArrowDropDownLine className="inline-block float-right" /></button>
                  {showStatusDropdown && (
                    <StatusDropdown
                      statuses={statuses}
                      onSubmit={handleStatusSubmit}
                      onClose={() => setShowStatusDropdown(false)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex justify-between mt-4 space-x-2">
          <td className="font-bold text-gray-300">
          <button>
            Add more team...
          </button>
          </td>
          <div className="flex space-x-2">
            <button
              onClick={handleRemoveClick}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Remove
            </button>
            {showCheckboxes && (
              <button
                onClick={handleCancelClick}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </LayoutProject>
  );
};

export default TeamTable;



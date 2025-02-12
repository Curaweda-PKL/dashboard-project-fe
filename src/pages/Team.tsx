import { useState } from "react";
import LayoutProject from "../layout/layoutProject";
import { RiPencilFill, RiDeleteBinFill, RiArrowDownSLine } from "react-icons/ri";
import DropdownRole from "../component/dropdownRole"; // Import komponen dropdownRole
import DropdownAssigned from "../component/dropdownAssigned"; // Import komponen dropdownAssigned
import RemoveTeamModal from "../component/removeTeam";
import Swal from "sweetalert2";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  assigned: string;
}

const TeamTable = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
    setActiveDropdown(null); // Pastikan semua dropdown tertutup
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
    setActiveDropdown(null); // Pastikan semua dropdown tertutup
  };

  const handleRemoveClick = (member: TeamMember) => {
    setMemberToRemove(member);
    setShowRemoveModal(true);
  };

  const handleDropdownToggle = (dropdownType: string) => {
    setActiveDropdown((prev) => (prev === dropdownType ? null : dropdownType));
  };

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

  const showSuccessToast = () => {
    Toast.fire({
      icon: "success",
      title: "Team has been changed",
      background: "rgb(0, 208, 255)", // Warna biru untuk background
      color: "#000000", // Warna teks agar terlihat jelas
    });
  };

  const teamMembers: TeamMember[] = [
    { id: 1, name: "Gustavo Bergson", role: "FrontEnd Developer", assigned: "TourO Web development" },
    { id: 2, name: "Kaylynn Baptista", role: "BackEnd Developer", assigned: "Dashboard Portal" },
    { id: 3, name: "Alfredo Lipshutz", role: "FrontEnd Developer", assigned: "Designing" },
    { id: 4, name: "Alena Passaquinidci Arcand", role: "UI/UX Designer", assigned: "Project" },
  ];

  return (
    <LayoutProject>
      <div className="p-4 flex flex-col">
        <table className="text-center w-full rounded-lg overflow-hidden">
          <thead className="bg-curawedaColor text-white">
            <tr>
              <th className="p-4 text-left">NAME</th>
              <th className="p-4 text-left">ROLE</th>
              <th className="p-4 text-left">ASSIGNED</th>
              <th className="p-4 text-right">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-100">
                <td className="p-4 text-left font-medium">{member.name}</td>
                <td className="p-4 text-left font-medium">{member.role}</td>
                <td className="p-4 text-left font-medium">{member.assigned}</td>
                <td className="p-4 text-right">
                  <button
                    className="text-green-500 hover:text-green-600 mr-2"
                    onClick={() => handleEditClick(member)}
                  >
                    <RiPencilFill size={20} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveClick(member)}
                  >
                    <RiDeleteBinFill size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showEditModal && editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              {/* Tombol X untuk menutup modal */}
              <button
                onClick={handleCloseEditModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-center text-2xl font-bold mb-4">Edit Team</h2>
              <div className="mb-4">
                <label className="block text-bold font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  className="w-full border border-black bg-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-bold font-bold mb-2">Role</label>
                <div
                  onClick={() => handleDropdownToggle("role")}
                  className="border border-black p-2 rounded-full cursor-pointer flex justify-between items-center"
                >
                  {editingMember.role || "Select Role"}
                  <RiArrowDownSLine size={25} className="ml-2" />
                </div>
                {activeDropdown === "role" && (
                  <DropdownRole
                    roles={["FrontEnd Developer", "BackEnd Developer", "UI/UX Designer"]}
                    onSubmit={(selectedRole) => {
                      setEditingMember({ ...editingMember, role: selectedRole });
                      setActiveDropdown(null); // Tutup dropdown setelah memilih
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>
              <div className="mb-4 relative">
                <label className="block text-bold font-bold mb-2">Assigned</label>
                <div
                  onClick={() => handleDropdownToggle("assigned")}
                  className="border border-black p-2 rounded-full cursor-pointer flex justify-between items-center"
                >
                  {editingMember.assigned || "Select Assigned"}
                  <RiArrowDownSLine size={25} className="ml-2" />
                </div>
                {activeDropdown === "assigned" && (
                  <DropdownAssigned
                    roles={["TourO Web development", "Dashboard Portal", "Designing", "Project"]}
                    onSubmit={(selectedAssigned) => {
                      setEditingMember({ ...editingMember, assigned: selectedAssigned });
                      setActiveDropdown(null); // Tutup dropdown setelah memilih
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    console.log("Updated Member:", editingMember);
                    handleCloseEditModal(); // Tutup modal setelah submit
                    showSuccessToast(); // Tampilkan notifikasi sukses
                  }}
                  className="bg-curawedaColor text-white font-bold px-4 py-2 rounded-full w-full hover:bg-[#029FCC]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showRemoveModal && memberToRemove && (
          <RemoveTeamModal
            member={memberToRemove}
            onClose={() => setShowRemoveModal(false)}
            onRemove={() => {
              console.log("Removing member:", memberToRemove);
              setShowRemoveModal(false);
            }}
          />
        )}
      </div>
    </LayoutProject>
  );
};

export default TeamTable;

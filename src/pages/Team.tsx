import { useState, useEffect } from "react";
import LayoutProject from "../layout/layoutProject";
import { RiPencilFill, RiDeleteBinFill, RiArrowDownSLine } from "react-icons/ri";
import Swal from "sweetalert2";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  assigned: string;
}

// DropdownRole Component
interface RoleDropdownProps {
  roles: string[];
  onSubmit: (selectedRoles: string) => void;
  onClose: () => void;
}

const DropdownRole: React.FC<RoleDropdownProps> = ({ roles, onSubmit, onClose }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Handle selecting/deselecting a role
  const toggleRoleSelection = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="fixed top-1/5 right-1/3 transform -translate-x-1/3 -translate-y-1/5 bg-white p-6 rounded-lg shadow-lg w-72 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">Edit Role</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2"
        >
          &times;
        </button>
      </div>

      {/* Roles List with Checkboxes */}
      <div className="h-32 overflow-y-auto border-b">
        {roles.map((role) => (
          <div
            key={role}
            className="flex items-center py-2 px-4 cursor-pointer border-b text-gray-700 hover:bg-gray-100"
            onClick={() => toggleRoleSelection(role)}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                selectedRoles.includes(role) ? "bg-[#02CCFF]" : "bg-[#6D6D6D]"
              }`}
            ></div>
            <span>{role}</span>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            const formattedRoles = selectedRoles.join(", ");
            onSubmit(formattedRoles); // Send selected roles
            onClose(); // Close the dropdown
          }}
          className="bg-curawedaColor text-white font-bold px-4 py-2 rounded-full w-full hover:bg-[#029FCC]"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// DropdownAssigned Component
interface AssignedDropdownProps {
  roles: string[];
  onSubmit: (selectedAssigned: string) => void;
  onClose: () => void;
}

const DropdownAssigned: React.FC<AssignedDropdownProps> = ({ roles, onSubmit, onClose }) => {
  return (
    <div className="fixed top-1/5 right-1/3 transform -translate-x-1/3 -translate-y-1/5 bg-white p-6 rounded-lg shadow-lg w-72 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">Edit Assigned</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2">
          &times;
        </button>
      </div>

      {/* Assigned List with Scroll and Bottom Border */}
      <div className="h-32 overflow-y-auto border-b">
        {roles.map((assigned) => (
          <div
            key={assigned}
            onClick={() => {
              onSubmit(assigned); // Trigger onSubmit with the selected assigned
              onClose(); // Close the dropdown
            }}
            className="py-2 text-center cursor-pointer border-b text-gray-700 hover:bg-gray-100 hover:font-bold"
          >
            {assigned}
          </div>
        ))}
      </div>
    </div>
  );
};

// RemoveTeamModal Component
interface RemoveTeamModalProps {
  member: { name: string; id: number };
  onClose: () => void;
  onRemove: () => void;
}

const RemoveTeamModal: React.FC<RemoveTeamModalProps> = ({ member, onClose, onRemove }) => {
  const handleRemove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${member.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09abca",
      cancelButtonColor: "#6D6D6D",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onRemove();
        Swal.fire("Deleted!", `${member.name} has been deleted.`, "success");

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
          title: "Project has been removed",
          background: "rgb(0, 208, 255)",
          color: "#000000",
        });
      }
    });
  };

  useEffect(() => {
    handleRemove();
    onClose();
  }, [member, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Delete Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <p className="mb-4">
          Are you sure you want to delete {member.name}? This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

// Main TeamTable Component
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
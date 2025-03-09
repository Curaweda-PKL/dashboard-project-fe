import { useState, useEffect } from "react";
import LayoutProject from "../layout/layoutProject";
import { RiPencilFill, RiArrowDownSLine } from "react-icons/ri";
import Swal from "sweetalert2";
import teamApi, { TeamMember } from "../component/api/TeamApi";

// Komponen DropdownAssigned untuk memilih Assigned (menggunakan dropdown)
interface AssignedDropdownProps {
  roles: string[];
  onSubmit: (selectedAssigned: string) => void;
  onClose: () => void;
}

const DropdownAssigned: React.FC<AssignedDropdownProps> = ({ roles, onSubmit, onClose }) => {
  return (
    <div className="fixed top-1/5 right-1/3 transform -translate-x-1/3 -translate-y-1/5 bg-white p-6 rounded-lg shadow-lg w-72 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">Edit Assigned</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2">
          &times;
        </button>
      </div>
      <div className="h-32 overflow-y-auto border-b">
        {roles.map((assigned) => (
          <div
            key={assigned}
            onClick={() => {
              onSubmit(assigned);
              onClose();
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

const TeamTable = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Ambil data team member dari backend saat komponen pertama kali dimount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const members = await teamApi.getAllTeams();
        console.log("Fetched team members:", members);
        setTeamMembers(members);
      } catch (err: any) {
        setError("Error fetching team members");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
    setActiveDropdown(null);
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
      background: "rgb(0, 208, 255)",
      color: "#000000",
    });
  };

  // Fungsi update: mengirim role dan assigned ke backend (Name tidak diubah)
  const handleUpdateMember = async () => {
    if (!editingMember || editingMember.id === undefined) return;
    try {
      const updatedMember = await teamApi.updateTeamMember(editingMember.id, {
        // Name tidak dikirim untuk diupdate karena tidak boleh diubah
        name: editingMember.name,
        role: editingMember.role,
        assigned: editingMember.assigned,
      });
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      showSuccessToast();
      handleCloseEditModal();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <LayoutProject>
      <div className="p-4 flex flex-col">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {teamMembers.length > 0 ? (
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
                      className="text-green-500 hover:text-green-600"
                      onClick={() => handleEditClick(member)}
                    >
                      <RiPencilFill size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No team members found</p>
        )}

        {showEditModal && editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={handleCloseEditModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-center text-2xl font-bold mb-4">Edit Team</h2>
              <div className="mb-4">
                <label className="block font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={editingMember.name}
                  readOnly
                  className="w-full border border-black bg-gray-100 rounded-full p-2 focus:outline-none"
                />
              </div>
              {/* Field Role: Input text untuk edit role */}
              <div className="mb-4">
                <label className="block font-bold mb-2">Role</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  className="w-full border border-black bg-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4 relative">
                <label className="block font-bold mb-2">Assigned</label>
                <div
                  onClick={() => handleDropdownToggle("assigned")}
                  className="border border-black p-2 rounded-full cursor-pointer flex justify-between items-center"
                >
                  {editingMember.assigned || "Select Assigned"}
                  <RiArrowDownSLine size={25} className="ml-2" />
                </div>
                {activeDropdown === "assigned" && (
                  <DropdownAssigned
                    roles={[
                      "TourO Web development",
                      "Dashboard Portal",
                      "Designing",
                      "Project",
                    ]}
                    onSubmit={(selectedAssigned) => {
                      setEditingMember({ ...editingMember, assigned: selectedAssigned });
                      setActiveDropdown(null);
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleUpdateMember}
                  className="bg-curawedaColor text-white font-bold px-4 py-2 rounded-full w-full hover:bg-[#029FCC]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutProject>
  );
};

export default TeamTable;

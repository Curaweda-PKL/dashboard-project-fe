import React, { useState, useEffect } from "react";
import LayoutProject from "../layout/layoutProject";
import { RiPencilFill, RiArrowDownSLine } from "react-icons/ri";
import Swal from "sweetalert2";
import teamApi, { TeamMember, TeamCreatePayload } from "../component/api/TeamApi";
import accountApi, { UserSummary } from "../component/api/accountApi";

// Komponen UserDropdown untuk memilih user berdasarkan name
interface UserDropdownProps {
  users: UserSummary[];
  onSubmit: (selectedUser: UserSummary) => void;
  onClose: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ users, onSubmit, onClose }) => {
  return (
    <div className="fixed top-1/5 right-1/3 transform -translate-x-1/3 -translate-y-1/3 bg-white p-6 rounded-lg shadow-lg w-72 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center w-full">Select User</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 absolute top-0 right-0 mt-2 mr-2"
        >
          &times;
        </button>
      </div>
      <div className="h-48 overflow-y-auto border-b">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              onSubmit(user);
              onClose();
            }}
            className="py-2 text-center cursor-pointer border-b text-gray-700 hover:bg-gray-100 hover:font-bold"
          >
            {user.name} (ID: {user.id})
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen reusable untuk input yang bisa diedit
interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange, readOnly = false }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="w-full border border-black bg-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

// Interface untuk form create team
interface CreateTeamFormData {
  user_id: number | null;
  userName: string;
  division: string;
  status: string;
}

const TeamTable: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);

  // State untuk modal create (tanpa field Assigned)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState<CreateTeamFormData>({
    user_id: null,
    userName: "",
    division: "",
    status: "",
  });

  // Ambil data team member dan user saat komponen mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const members = await teamApi.getAllTeams();
        setTeamMembers(members);
      } catch (err: any) {
        setError("Error fetching team members");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await accountApi.getAllUser();
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error fetching users");
      }
    };

    fetchTeamMembers();
    fetchUsers();
  }, []);

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const toggleEditingMode = () => {
    setIsEditing(!isEditing);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No team member selected",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09ABCA",
      cancelButtonColor: "#6A6A6A",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      await Promise.all(
        selectedIds.map(async (id) => {
          try {
            await teamApi.deleteTeamMember(id);
          } catch (err) {
            console.error(`Error deleting id ${id}:`, err);
          }
          return true;
        })
      );
      const updatedMembers = await teamApi.getAllTeams();
      setTeamMembers(updatedMembers);
      setSelectedIds([]);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Team member(s) has been removed",
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

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
    setActiveDropdown(null);
  };

  // Update member (tanpa properti assigned)
  const handleUpdateMember = async () => {
    if (!editingMember || editingMember.id === undefined) return;
    try {
      const updatedMember = await teamApi.updateTeamMember(editingMember.id, {
        division: editingMember.division,
        status: editingMember.status,
      });
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === updatedMember.id
            ? { ...member, ...updatedMember, name: member.name }
            : member
        )
      );
      Swal.fire({
        icon: "success",
        title: "Team member updated successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
      handleCloseEditModal();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Create member: setelah create, data langsung ditambahkan ke state sehingga tampil tanpa refresh
  const handleCreateMember = async () => {
    try {
      if (!newMemberData.user_id) {
        Swal.fire({
          icon: "warning",
          title: "Please select a user",
          background: "rgb(0, 208, 255)",
          color: "#000000",
        });
        return;
      }
      const payload: TeamCreatePayload = {
        user_id: newMemberData.user_id,
        division: newMemberData.division,
        status: newMemberData.status,
      };
      const createdMember = await teamApi.createTeamMember(payload);
      setTeamMembers((prev) => [...prev, createdMember]);
      Swal.fire({
        icon: "success",
        title: "Team member created successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
      setShowCreateModal(false);
      setNewMemberData({ user_id: null, userName: "", division: "", status: "" });
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <LayoutProject>
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Team Members</h1>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {teamMembers.length > 0 ? (
          <table className="text-center w-full rounded-lg overflow-hidden">
            <thead className="bg-curawedaColor text-white">
              <tr>
                {isEditing && <th className="p-4"></th>}
                <th className="p-4 text-left">NAME</th>
                <th className="p-4 text-left">DIVISI</th>
                <th className="p-4 text-left">STATUS</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-100">
                  {isEditing && (
                    <td className="p-4">
                      <label className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(member.id!)}
                          onChange={() => handleCheckboxChange(member.id!)}
                          className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-full checked:bg-curawedaColor checked:border-curawedaColor transition duration-200 cursor-pointer"
                        />
                      </label>
                    </td>
                  )}
                  <td className="p-4 text-left font-medium">{member.name}</td>
                  <td className="p-4 text-left font-medium">{member.division}</td>
                  <td className="p-4 text-left font-medium">{member.status}</td>
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

        {/* Edit Modal */}
        {showEditModal && editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={handleCloseEditModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-center text-2xl font-bold mb-4">Edit Team Member</h2>
              <EditableField label="Name" value={editingMember.name} onChange={() => {}} readOnly />
              <EditableField
                label="Divisi"
                value={editingMember.division}
                onChange={(value) => setEditingMember({ ...editingMember, division: value })}
              />
              <EditableField
                label="Status"
                value={editingMember.status}
                onChange={(value) => setEditingMember({ ...editingMember, status: value })}
              />
              {/* Field Assigned dihapus */}
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

        {/* Create Modal with User Dropdown */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-center text-2xl font-bold mb-4">Create Team Member</h2>
              {/* User Dropdown */}
              <div className="mb-4 relative">
                <label className="block font-bold mb-2">Name *</label>
                <div
                  onClick={() => setActiveDropdown("Name")}
                  className="border border-black p-2 rounded-full cursor-pointer flex justify-between items-center"
                >
                  {newMemberData.userName || "Select Name"}
                  <RiArrowDownSLine size={25} className="ml-2" />
                </div>
                {activeDropdown === "user" && (
                  <UserDropdown
                    users={users}
                    onSubmit={(selectedUser) => {
                      setNewMemberData({
                        ...newMemberData,
                        user_id: selectedUser.id,
                        userName: selectedUser.name,
                      });
                      setActiveDropdown(null);
                    }}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>
              <EditableField
                label="Division *"
                value={newMemberData.division || ""}
                onChange={(value) => setNewMemberData({ ...newMemberData, division: value })}
              />
              <EditableField
                label="Status"
                value={newMemberData.status || ""}
                onChange={(value) => setNewMemberData({ ...newMemberData, status: value })}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleCreateMember}
                  className="bg-curawedaColor text-white font-bold px-4 py-2 rounded-full w-full hover:bg-[#029FCC]"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tombol Add Team & Remove di bawah kanan */}
        <div className="fixed bottom-10 right-10 flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-curawedaColor text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-[#029FCC] transition duration-200"
          >
            Add Team
          </button>
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
                onClick={handleRemoveSelected}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </LayoutProject>
  );
};

export default TeamTable;

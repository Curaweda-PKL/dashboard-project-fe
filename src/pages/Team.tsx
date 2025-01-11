import { useState } from "react";
import LayoutProject from "../layout/layoutProject";
import { RiPencilFill, RiDeleteBinFill } from "react-icons/ri";
import EditTeamModal from "../component/editteam";
import RemoveTeamModal from "../component/removeTeam"; // Import komponen RemoveTeamModal

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: string;
}

const TeamTable = () => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false); // State untuk modal penghapusan
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null); // Menyimpan member yang akan dihapus

  const handleCancelClick = () => {
    setShowCheckboxes(false);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMember(null);
  };

  const handleRemoveClick = (member: TeamMember) => {
    setMemberToRemove(member); // Set member yang akan dihapus
    setShowRemoveModal(true); // Tampilkan modal penghapusan
  };

  const teamMembers: TeamMember[] = [
    { id: 1, name: "Gustavo Bergson", role: "FrontEnd Developer", status: "PKL" },
    { id: 2, name: "Kaylynn Baptista", role: "BackEnd Developer", status: "Incubation" },
    { id: 3, name: "Alfredo Lipshutz", role: "FrontEnd Developer", status: "Employee" },
    { id: 4, name: "Alena Passaquinidci Arcand", role: "UI/UX Designer", status: "PKL" },
  ];

  return (
    <LayoutProject>
      <div className="p-4 flex flex-col">
        <table className="text-center w-full rounded-lg overflow-hidden">
          <thead className="bg-curawedaColor text-white">
            <tr>
              <th className="p-4 text-left">NAME</th>
              <th className="p-4 text-left">ROLE</th>
              <th className="p-4 text-left">STATUS</th>
              <th className="p-4 text-right">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-100">
                <td className="p-4 text-left font-medium">{member.name}</td>
                <td className="p-4 text-left font-medium">{member.role}</td>
                <td className="p-4 text-left font-medium">{member.status}</td>
                <td className="p-4 text-right">
                  <button
                    className="text-green-500 hover:text-green-600 mr-2"
                    onClick={() => handleEditClick(member)}
                  >
                    <RiPencilFill size={20} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveClick(member)} // Menangani klik tombol remove
                  >
                    <RiDeleteBinFill size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showEditModal && editingMember && (
          <EditTeamModal
            member={editingMember}
            onClose={handleCloseEditModal}
          />
        )}

        {showRemoveModal && memberToRemove && (
          <RemoveTeamModal
            member={memberToRemove}
            onClose={() => setShowRemoveModal(false)} // Menutup modal penghapusan
            onRemove={() => {
              // Logika penghapusan member
              console.log("Removing member:", memberToRemove);
              setShowRemoveModal(false); // Menutup modal setelah penghapusan
            }}
          />
        )}

        <div className="flex justify-end mt-4">
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
    </LayoutProject>
  );
};

export default TeamTable;

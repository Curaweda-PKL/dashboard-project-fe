import React, { useEffect, useState } from "react";
import { FiUser, FiUserPlus, FiUserMinus } from "react-icons/fi";
import Swal from "sweetalert2";

interface Member {
  id: number;
  name: string;
  role: string;
  status: string;
  isAdded: boolean; // Indicates if the member is already added to the project
}

const AddTeamProject: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialMembers, setInitialMembers] = useState<Member[]>([]);
  const [isChanged, setIsChanged] = useState(false); // Detect if there are any changes

  useEffect(() => {
    // Simulate fetching members data
    const fetchMembers = () => {
      const teamMembers: Member[] = [
        { id: 1, name: "Gustavo Bergson", role: "FrontEnd Developer", status: "PKL", isAdded: true },
        { id: 2, name: "Kaylynn Baptista", role: "BackEnd Developer", status: "Incubation", isAdded: true },
        { id: 3, name: "Alfredo Lipshutz", role: "FrontEnd Developer", status: "Employee", isAdded: false },
        { id: 4, name: "Alena Passaquinidci Arcand", role: "UI/UX Designer", status: "PKL", isAdded: false },
      ];
      setMembers(teamMembers);
      setInitialMembers(teamMembers); // Save the initial state
    };

    fetchMembers();
  }, []);

  const toggleMember = (id: number) => {
    setMembers((prev) => {
      const updatedMembers = prev.map((member) =>
        member.id === id ? { ...member, isAdded: !member.isAdded } : member
      );
      setIsChanged(!isEqual(updatedMembers, initialMembers)); // Check if there's a change
      return updatedMembers;
    });
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleSubmit = () => {
    setIsEditMode(false);
    const sortedMembers = [...members].sort((a, b) => (a.isAdded < b.isAdded ? 1 : -1)); // Sort members after submit
    setMembers(sortedMembers); // Update members with sorted order
    setInitialMembers(sortedMembers); // Update initial members with sorted order
    setIsChanged(false); // Reset the change state
    console.log("Updated Members:", sortedMembers);

    // Menambahkan notifikasi success setelah submit
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
      title: "Team has been changed", // Pesan yang muncul
      background: "rgb(0, 208, 255)", // Warna biru untuk background
      color: "#000000", // Warna teks agar terlihat jelas
    });
  };

  const handleCancel = () => {
    setMembers(initialMembers); // Revert to initial state if canceled
    setIsChanged(false); // Reset the change state
  };

  const handleBack = () => {
    // Ensure no changes are retained when back is pressed
    setMembers(initialMembers); // Revert to initial state
    setIsEditMode(false); // Exit edit mode
    setIsChanged(false); // Reset change state
  };

  const isEqual = (arr1: Member[], arr2: Member[]) => {
    // Utility function to check if two arrays are equal
    return arr1.every((member, index) => member.isAdded === arr2[index].isAdded);
  };

  // Sort members only after submitting
  const sortedMembers = isEditMode ? members : [...members].sort((a, b) => (a.isAdded < b.isAdded ? 1 : -1));

  return (
    <div className="p-6 relative">
      {members.length > 0 ? (
        <table className="w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              <th className="p-4 rounded-tl-lg border-b-4 border-white font-bold text-lg">
                NAME
              </th>
              <th className="p-4 border-b-4 border-white font-bold text-lg">ROLE</th>
              <th className="p-4 rounded-tr-lg border-b-4 border-white font-bold text-lg">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t text-center text-black font-bold hover:bg-gray-100 transition duration-200"
              >
                <td className="p-4 relative">
                  {/* Icon part */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    {isEditMode ? (
                      member.isAdded ? (
                        <FiUserMinus
                          className="text-[#B20000] cursor-pointer"
                          onClick={() => toggleMember(member.id)}
                        />
                      ) : (
                        <FiUserPlus
                          className="text-[#0AB239] cursor-pointer"
                          onClick={() => toggleMember(member.id)}
                        />
                      )
                    ) : (
                      member.isAdded && <FiUser className="text-curawedaColor" />
                    )}
                  </div>
                  {/* Name part */}
                  <div className="pl-10">{member.name}</div>
                </td>
                <td className="p-4">{member.role}</td>
                <td className="p-4">{member.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No members available.</p>
      )}

      {/* Edit Team Buttons */}
      {isEditMode && (
        <div className="fixed bottom-10 right-10 flex gap-4">
          <button
            className="bg-[#6D6D6D] text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#494949] transition"
            onClick={handleBack}
          >
            Back
          </button>
          {isChanged && (
            <>
              <button
                className="bg-[#B20000] text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-red-900 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-curawedaColor text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#029FCC] transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </>
          )}
        </div>
      )}

      {!isEditMode && !isChanged && (
        <button
          className="fixed bottom-10 right-10 bg-curawedaColor text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#029FCC] transition"
          onClick={handleEditMode}
        >
          Edit Team
        </button>
      )}
    </div>
  );
};

export default AddTeamProject;

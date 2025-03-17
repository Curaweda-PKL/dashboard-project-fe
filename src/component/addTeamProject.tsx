import React, { useEffect, useState } from "react";
import { FiUser, FiUserPlus, FiUserMinus } from "react-icons/fi";
import Swal from "sweetalert2";
import teamApi from "./api/TeamProjectApi";// Pastikan path sesuai dengan lokasi teamApi Anda

interface Member {
  id: number;
  name: string;
  role: string;
  status: string;
  isAdded: boolean; // Menandakan apakah member sudah ditambahkan ke proyek
}

const AddTeamProject: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialMembers, setInitialMembers] = useState<Member[]>([]);
  const [isChanged, setIsChanged] = useState(false); // Deteksi jika ada perubahan

  useEffect(() => {
    // Mengambil data team member dari API melalui teamApi
    const fetchMembers = async () => {
      try {
        const apiMembers = await teamApi.getAllTeams();
        // Mapping data API ke format komponen, tentukan isAdded berdasarkan field assigned (jika ada, berarti sudah ditambahkan)
        const mappedMembers: Member[] = apiMembers.map((tm) => ({
          id: tm.id,
          name: tm.name,
          role: tm.role,
          status: tm.status,
          isAdded: !!tm.assigned, // jika assigned bernilai truthy, maka isAdded true
        }));
        setMembers(mappedMembers);
        setInitialMembers(mappedMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchMembers();
  }, []);

  // Utility untuk membandingkan dua array berdasarkan properti isAdded
  const isEqual = (arr1: Member[], arr2: Member[]) => {
    return arr1.every((member, index) => member.isAdded === arr2[index].isAdded);
  };

  const toggleMember = (id: number) => {
    setMembers((prev) => {
      const updatedMembers = prev.map((member) =>
        member.id === id ? { ...member, isAdded: !member.isAdded } : member
      );
      setIsChanged(!isEqual(updatedMembers, initialMembers));
      return updatedMembers;
    });
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  // Saat submit, update perubahan ke backend untuk tiap member yang berubah isAdded-nya.
  const handleSubmit = async () => {
    setIsEditMode(false);
    // Mengurutkan member: member yang sudah ditambahkan akan berada di urutan atas
    const sortedMembers = [...members].sort((a, b) => (a.isAdded < b.isAdded ? 1 : -1));
    // Identifikasi member yang statusnya berubah dibandingkan dengan kondisi awal
    const updatedMembers = sortedMembers.filter(
      (member, index) => member.isAdded !== initialMembers[index].isAdded
    );

    try {
      // Update setiap member yang berubah menggunakan teamApi.updateTeamMember
      // Disini kita update field assigned: jika member sudah ditambahkan, set ke "added", jika tidak, set sebagai string kosong.
      await Promise.all(
        updatedMembers.map((member) =>
          teamApi.updateTeamMember(member.id, { assigned: member.isAdded ? "added" : "" })
        )
      );
      // Setelah update berhasil, perbarui state initial dan reset flag perubahan
      setMembers(sortedMembers);
      setInitialMembers(sortedMembers);
      setIsChanged(false);

      console.log("Updated Members:", sortedMembers);

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
        title: "Team has been changed",
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
    } catch (error) {
      console.error("Error updating team members:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating team members. Please try again.",
      });
    }
  };

  // Batalkan perubahan dan kembalikan ke kondisi awal
  const handleCancel = () => {
    setMembers(initialMembers);
    setIsChanged(false);
  };

  // Kembali ke mode tampilan tanpa menyimpan perubahan
  const handleBack = () => {
    setMembers(initialMembers);
    setIsEditMode(false);
    setIsChanged(false);
  };

  // Jika tidak dalam mode edit, urutkan member sehingga member yang sudah ditambahkan berada di atas
  const sortedMembers = isEditMode ? members : [...members].sort((a, b) => (a.isAdded < b.isAdded ? 1 : -1));

  return (
    <div className="p-6 relative">
      {members.length > 0 ? (
        <table className="w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#02CCFF] text-white text-center">
              <th className="p-4 rounded-tl-lg border-b-4 border-white font-bold text-lg">NAME</th>
              <th className="p-4 border-b-4 border-white font-bold text-lg">ROLE</th>
              <th className="p-4 rounded-tr-lg border-b-4 border-white font-bold text-lg">STATUS</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t text-center text-black font-bold hover:bg-gray-100 transition duration-200"
              >
                <td className="p-4 relative">
                  {/* Icon untuk menambah atau menghapus member */}
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

      {/* Tombol untuk mode edit */}
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

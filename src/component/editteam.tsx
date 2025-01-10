import React, { useState, useEffect } from "react";

interface EditTeamModalProps {
  member: { name: string; role: string; status: string }; // Tipe data untuk anggota tim
  onClose: () => void; // Fungsi untuk menutup modal
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ member, onClose }) => {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [status, setStatus] = useState(member.status);

  useEffect(() => {
    // Menyinkronkan state dengan props member saat modal pertama kali terbuka
    setName(member.name);
    setRole(member.role);
    setStatus(member.status);
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kirim data yang sudah diubah ke parent (TeamTable)
    console.log("Updated data:", { name, role, status });
    // Bisa ditambahkan kode untuk mengirim data ke server atau update state di parent
    onClose(); // Menutup modal setelah submit
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Team</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              id="status"
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTeamModal;

import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk navigasi

interface LogOutProps {
  onClose: () => void; // Prop untuk menutup popup
}

const LogOut: React.FC<LogOutProps> = ({ onClose }) => {
  const navigate = useNavigate(); // Inisialisasi navigator

  const handleLogOut = () => {
    // Logika logout di sini
    console.log("Logged out!");
    onClose(); // Menutup popup setelah logout
    navigate("/auth/login"); // Arahkan ke halaman login
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
      <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[500px] flex flex-col justify-between">
          {/* Judul Popup */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mt-6 mb-6">
            Log Out
          </h2>

          {/* Keterangan */}
          <p className="text-center text-gray-600 mb-8 flex-grow">
            Are you sure you want to Logout?
          </p>

          {/* Tombol Save dan Cancel */}
          <div className="flex justify-center space-x-20 mb-6">
            <button
              onClick={onClose} // Menutup popup saat Cancel
              className="px-10 py-3 bg-gray-300 hover:bg-gray-400 text-black rounded-full text-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleLogOut} // Navigasi ke halaman login
              className="px-9 py-3 bg-[#FF0000] hover:bg-red-700 text-black rounded-full text-lg"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogOut;

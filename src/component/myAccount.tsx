import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyAccount: React.FC = () => {
  const [username] = useState("User Name");
  const [email, setEmail] = useState("axyz@gmail.com");
  const [password, setPassword] = useState("********");
  const [isEmailPopupVisible, setIsEmailPopupVisible] = useState(false);
  const [isPasswordPopupVisible, setIsPasswordPopupVisible] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState(""); // Kosongkan input initial untuk current password
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const navigate = useNavigate();

  const handleEditEmail = () => {
    setIsEmailPopupVisible(true);
  };

  const handleEditPassword = () => {
    setIsPasswordPopupVisible(true);
  };

  const handleSaveEmail = () => {
    setEmail(newEmail);
    setIsEmailPopupVisible(false);

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
      title: "Email changed successfully",
      background: "rgb(0, 208, 255)", // Warna biru untuk background
      color: "#000000", // Warna teks agar terlihat jelas
    });
  };

  const handleSavePassword = () => {
    if (newPassword === confirmNewPassword) {
      setPassword(newPassword);
      setIsPasswordPopupVisible(false);

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
        title: "Password changed successfully",
        background: "rgb(0, 208, 255)", // Warna biru untuk background
        color: "#000000", // Warna teks agar terlihat jelas
      });

    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className="relative">
      {/* Judul di Kiri Atas */}
      <h1 className="absolute top-0 left-0 text-2xl font-bold text-gray-800">
        My Account
      </h1>

      {/* Background Card */}
      <div
        className="absolute bg-[#02CCFF] rounded-lg shadow-lg"
        style={{
          width: "60%",
          height: "400px",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
      ></div>

      {/* Main Card */}
      <div
        className="relative z-10 bg-[#00ABD6] p-6 rounded-lg drop-shadow-lg"
        style={{
          width: "50%",
          maxWidth: "400px",
          margin: "0 auto",
          top: "115px",
        }}
      >
        {/* Card Content */}
        <div className="text-white">
          {/* Foto Profil */}
          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-400"></div>
          </div>

          {/* Username */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white">Username</h3>
              <p>{username}</p>
            </div>
            <button
              onClick={() => navigate("/settings/profiles", { state: { username } })}
              className="bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
            >
              Edit
            </button>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white">Email</h3>
              <p>{email}</p>
            </div>
            <button
              onClick={handleEditEmail}
              className="bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
            >
              Edit
            </button>
          </div>

          {/* Password */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white">Password</h3>
              <p>{password}</p>
            </div>
            <button
              onClick={handleEditPassword}
              className="bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up untuk Edit Email */}
      {isEmailPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[400px] flex flex-col">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-20">
                Edit Email
              </h2>
              <div className="mb-6">
                <label className="block text-gray-800 font-bold mb-2">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="p-3 rounded-full border-2 border-black w-full text-black mx-auto"
                />
              </div>
              <div className="flex justify-center space-x-20 mt-auto mb-4">
                <button
                  onClick={() => setIsEmailPopupVisible(false)}
                  className="px-9 py-3 bg-[#6A6A6A] hover:bg-[#494949] text-white rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmail}
                  className="px-10 py-3 bg-[#02CCFF] hover:bg-[#029FCC] text-white rounded-full"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up untuk Edit Password */}
      {isPasswordPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[500px] flex flex-col">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                Edit Password
              </h2>
              <div className="mb-4">
                <label className="block text-gray-800 font-bold mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="p-3 rounded-full border-2 border-black w-full text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-800 font-bold mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-3 rounded-full border-2 border-black w-full text-black"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 font-bold mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="p-3 rounded-full border-2 border-black w-full text-black"
                />
              </div>
              <div className="flex justify-center space-x-20 mt-auto mb-4">
                <button
                  onClick={() => setIsPasswordPopupVisible(false)}
                  className="px-9 py-3 bg-[#6A6A6A] hover:bg-[#494949] text-white rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  className="px-10 py-3 bg-[#02CCFF] hover:bg-[#029FCC] text-white rounded-full"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import myAccountApi from "../component/api/MyAccountApi";

const MyAccount: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("********");
  const [isPhoneNumberPopupVisible, setIsPhoneNumberPopupVisible] = useState(false);
  const [isEmailPopupVisible, setIsEmailPopupVisible] = useState(false);
  const [isPasswordPopupVisible, setIsPasswordPopupVisible] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await myAccountApi.getCurrentUser();
        setEmail(userData.email || "");
        setPhoneNumber(userData.phone_number || "");
        setNewEmail(userData.email || "");
        setNewPhoneNumber(userData.phone_number || "");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load your profile. Please try again later.");
        Swal.fire({
          icon: "error",
          title: "Failed to load your profile",
          background: "#FFA7A7",
          color: "#000000",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditPhoneNumber = () => {
    setNewPhoneNumber(phoneNumber);
    setIsPhoneNumberPopupVisible(true);
  };

  const handleEditEmail = () => {
    setNewEmail(email);
    setIsEmailPopupVisible(true);
  };

  const handleEditPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsPasswordPopupVisible(true);
  };

  const handleSavePhoneNumber = async () => {
    try {
      setIsLoading(true);
      await myAccountApi.updatePhoneNumber(newPhoneNumber);
      setPhoneNumber(newPhoneNumber);
      setIsPhoneNumberPopupVisible(false);
      Swal.fire({
        icon: "success",
        title: "Phone Number changed successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
    } catch (err: any) {
      console.error("Failed to update phone number:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update phone number",
        confirmButtonColor: "#00D0FF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    try {
      setIsLoading(true);
      await myAccountApi.updateEmail(newEmail);
      setEmail(newEmail);
      setIsEmailPopupVisible(false);
      Swal.fire({
        icon: "success",
        title: "Email changed successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
      });
    } catch (err: any) {
      console.error("Failed to update email:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update email",
        confirmButtonColor: "#00D0FF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Passwords do not match",
          confirmButtonColor: "#00D0FF",
        });
        return;
      }
      if (!currentPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Current password is required",
          confirmButtonColor: "#00D0FF",
        });
        return;
      }
      if (newPassword.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "New password must be at least 6 characters long",
          confirmButtonColor: "#00D0FF",
        });
        return;
      }
      setIsLoading(true);
      // Hanya mengirim newPassword ke fungsi changePassword karena parameter currentPassword tidak digunakan
      const success = await myAccountApi.changePassword(newPassword);
      if (success) {
        setPassword("********");
        setIsPasswordPopupVisible(false);
        Swal.fire({
          icon: "success",
          title: "Password changed successfully",
          background: "rgb(0, 208, 255)",
          color: "#000000",
        });
      }
    } catch (err: any) {
      console.error("Failed to update password:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update password",
        confirmButtonColor: "#00D0FF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <h1 className="absolute top-0 left-0 text-2xl font-bold text-gray-800">
        My Account
      </h1>

      <div
        className="absolute bg-[#D9D9D9] rounded-lg shadow-lg"
        style={{
          width: "60%",
          height: "400px",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
      ></div>

      <div
        className="relative z-10 bg-[#B9B9B9] p-6 rounded-lg drop-shadow-lg"
        style={{
          width: "50%",
          maxWidth: "400px",
          margin: "0 auto",
          top: "115px",
        }}
      >
        <div className="text-white">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center rounded-lg z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-400"></div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white">Phone Number</h3>
              <p>{phoneNumber || "Not set"}</p>
            </div>
            <button
              onClick={handleEditPhoneNumber}
              className="bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
              disabled={isLoading}
            >
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white">Email</h3>
              <p>{email}</p>
            </div>
            <button
              onClick={handleEditEmail}
              className="bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
              disabled={isLoading}
            >
              Edit
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white">Password</h3>
              <p>{password}</p>
            </div>
            <button
              onClick={handleEditPassword}
              className="bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
              disabled={isLoading}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {isPhoneNumberPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[400px] flex flex-col">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-20">
                Edit Phone Number
              </h2>
              <div className="mb-6">
                <label htmlFor="new_phone" className="block text-gray-800 font-bold mb-2">
                  New Phone Number
                </label>
                <input
                  id="new_phone"
                  name="new_phone"
                  type="tel"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  className="bg-white p-3 rounded-full border-2 border-black w-full text-black"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-center space-x-20 mt-auto mb-4">
                <button
                  onClick={() => setIsPhoneNumberPopupVisible(false)}
                  className="px-9 py-3 bg-[#6D6D6D] hover:bg-[#494949] text-white rounded-full"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePhoneNumber}
                  className="px-10 py-3 bg-curawedaColor hover:bg-[#029FCC] text-white rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEmailPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[400px] flex flex-col">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-20">
                Edit Email
              </h2>
              <div className="mb-6">
                <label htmlFor="new_email" className="block text-gray-800 font-bold mb-2">
                  New Email
                </label>
                <input
                  id="new_email"
                  name="new_email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-white p-3 rounded-full border-2 border-black w-full text-black"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-center space-x-20 mt-auto mb-4">
                <button
                  onClick={() => setIsEmailPopupVisible(false)}
                  className="px-9 py-3 bg-[#6D6D6D] hover:bg-[#494949] text-white rounded-full"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmail}
                  className="px-10 py-3 bg-curawedaColor hover:bg-[#029FCC] text-white rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPasswordPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[500px] flex flex-col">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                Edit Password
              </h2>
              <div className="mb-4">
                <label htmlFor="current_password" className="block text-gray-800 font-bold mb-2">
                  Current Password
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white p-3 rounded-full border-2 border-black w-full text-black"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="new_password" className="block text-gray-800 font-bold mb-2">
                  New Password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white p-3 rounded-full border-2 border-black w-full text-black"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirm_new_password" className="block text-gray-800 font-bold mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirm_new_password"
                  name="confirm_new_password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="bg-white p-3 rounded-full border-2 border-black w-full text-black"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-center space-x-20 mt-auto mb-4">
                <button
                  onClick={() => setIsPasswordPopupVisible(false)}
                  className="px-9 py-3 bg-[#6D6D6D] hover:bg-[#494949] text-white rounded-full"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  className="px-10 py-3 bg-curawedaColor hover:bg-[#029FCC] text-white rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
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

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CiImageOn } from "react-icons/ci"; // Ikon gambar dari React Icons

const Profiles: React.FC = () => {
  const location = useLocation();
  const [username, setUsername] = useState<string>("User Name");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    }
  }, [location]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setHasChanges(newUsername !== "User Name");
  };

  const handleSaveUsername = () => {
    console.log("Username saved:", username);
    setHasChanges(false);
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      console.log("Image saved:", selectedImage.name);
    }
    setIsPopupVisible(false);
  };

  return (
    <div className="relative">
      <div className={`relative ${isPopupVisible ? "pointer-events-none" : ""}`}>
        {/* Judul di kiri atas */}
        <h1 className="absolute top-0 left-0 text-2xl font-bold text-gray-800">
          Profiles
        </h1>

        {/* Background Card */}
        <div
          className="absolute bg-[#02CCFF] rounded-lg shadow-lg"
          style={{
            width: "40%",
            height: "450px",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 0,
          }}
        ></div>

        {/* Main Card */}
        <div
          className="relative z-10 bg-[#0285A3] p-6 rounded-lg shadow-lg"
          style={{
            width: "50%",
            maxWidth: "400px",
            margin: "0 auto",
            top: "140px",
          }}
        >
          {/* Card Content */}
          <div className="text-white">
            {/* Foto Profil */}
            <div className="mb-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-400">
                {selectedImage && (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <button
                onClick={() => setIsPopupVisible(true)}
                className="mt-5 bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
              >
                Edit Profile
              </button>
            </div>

            {/* Form Edit Username */}
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="p-3 rounded-full w-full text-black"
              />
            </div>
          </div>
        </div>

        {/* Tombol Save Username */}
        {hasChanges && (
          <div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
            style={{ transition: "transform 0.3s ease-in-out" }}
          >
            <button
              onClick={handleSaveUsername}
              className="bg-[#02CCFF] hover:bg-blue-500 text-black px-10 py-5 rounded-full"
              style={{ animation: "slideUp 0.5s ease-out" }}
            >
              Save Username
            </button>
          </div>
        )}
      </div>

      {/* Popup */}
      {isPopupVisible && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] h-[600px] flex flex-col justify-between">
              {/* Judul */}
              <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
                Select an Image
              </h2>

              {/* Area Upload */}
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-[300px] h-[300px] bg-gray-300 rounded-lg mx-auto cursor-pointer hover:bg-gray-400 relative"
              >
                <CiImageOn className="h-32 w-32 text-gray-500" />

                {/* Teks "Upload Image" di bawah tengah */}
                <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-600 font-semibold">
                  Upload Image
                </p>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
              />

              {/* Tombol Save dan Cancel */}
              <div className="flex justify-center space-x-20 mt-4">
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="px-9 py-3 bg-gray-300 hover:bg-gray-400 text-black rounded-full text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveImage}
                  className="px-10 py-3 bg-[#02CCFF] hover:bg-blue-500 text-black rounded-full text-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profiles;

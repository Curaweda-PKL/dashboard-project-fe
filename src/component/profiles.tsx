import React, { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import Swal from "sweetalert2";
import userProfileApi from "../component/api/userProfilApi"; // Pastikan path sesuai

const Profiles: React.FC = () => {
  const [username, setUsername] = useState<string>("User Name");
  const [profilePic, setProfilePic] = useState<string | undefined>(undefined);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Ambil data profil user dari backend
  useEffect(() => {
    async function loadProfile() {
      try {
        // Jika userId belum tersimpan di localStorage, panggil fetchAndStoreCurrentUser
        if (!localStorage.getItem("userId")) {
          await userProfileApi.fetchAndStoreCurrentUser();
        }
        const profileData = await userProfileApi.getUserProfile();
        setUsername(profileData.name);
        setProfilePic(profileData.profile_pic);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    loadProfile();
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setHasChanges(newUsername !== "User Name");
  };

  const handleSaveUsername = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09abca",
      cancelButtonColor: "#6D6D6D",
      confirmButtonText: "Save",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedProfile = await userProfileApi.updateUserProfile({ name: username });
          setUsername(updatedProfile.name);
          setHasChanges(false);

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
            title: "Username changed successfully",
            background: "rgb(0, 208, 255)",
            color: "#000000",
          });
        } catch (error) {
          console.error("Error updating username:", error);
        }
      }
    });
  };

  const handleSaveImage = async () => {
    if (selectedImage) {
      try {
        const result = await userProfileApi.uploadProfilePicture(selectedImage);
        setProfilePic(result.profile_pic);

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
          title: "Profile picture changed successfully",
          background: "rgb(0, 208, 255)",
          color: "#000000",
        });
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
    setIsPopupVisible(false);
  };

  return (
    <div className="relative">
      <div className={`relative ${isPopupVisible ? "pointer-events-none" : ""}`}>
        <h1 className="absolute top-0 left-0 text-2xl font-bold text-gray-800">
          Profiles
        </h1>
        <div
          className="absolute bg-[#D9D9D9] rounded-lg shadow-lg"
          style={{
            width: "40%",
            height: "450px",
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
            top: "140px",
          }}
        >
          <div className="text-white">
            <div className="mb-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-400">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : null}
              </div>
              <button
                onClick={() => setIsPopupVisible(true)}
                className="mt-5 bg-gray-800 hover:bg-gray-600 font-bold text-white px-4 py-1 rounded-full"
              >
                Edit Profile
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="bg-white p-3 rounded-full w-full text-black"
              />
            </div>
          </div>
        </div>
        {hasChanges && (
          <div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2"
            style={{ transition: "transform 0.3s ease-in-out" }}
          >
            <button
              onClick={handleSaveUsername}
              className="bg-curawedaColor hover:bg-[#029FCC] text-white px-10 py-5 rounded-full"
              style={{ animation: "slideUp 0.5s ease-out" }}
            >
              Save Username
            </button>
          </div>
        )}
      </div>
      {isPopupVisible && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>
          <div className="fixed inset-0 flex justify-center items-center z-30 pointer-events-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] h-[600px] flex flex-col justify-between">
              <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
                Select an Image
              </h2>
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-[300px] h-[300px] bg-[#D9D9D9] rounded-lg mx-auto cursor-pointer hover:bg-gray-400 relative"
              >
                <CiImageOn className="h-32 w-32 text-gray-500" />
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
              <div className="flex justify-center space-x-20 mt-4">
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="px-9 py-3 bg-[#6D6D6D] hover:bg-[#494949] text-white rounded-full text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveImage}
                  className="px-10 py-3 bg-curawedaColor hover:bg-[#029FCC] text-white rounded-full text-lg"
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

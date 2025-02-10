import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLayout from "../../layout/layoutLogin";
import loginImage from "../../assets/Tampilan Login.png";
import Swal from "sweetalert2";

const InputNewPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      Swal.fire({
        icon: "success",
        title: "Password updated successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
      navigate("/auth/login");
    } else {
      Swal.fire({
        icon: "error",
        title: "Password is required",
        background: "rgb(255, 72, 66)",
        color: "#000000",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
    }
  };

  return (
    <LoginLayout>
      <div
        className="hidden lg:block lg:w-3/5 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      {/* Right Side: Form Section */}
      <div className="w-1/2 flex flex-col justify-center text-black items-center bg-white p-12">
        <h2 className="text-2xl font-bold mb-4">INPUT NEW PASSWORD</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-black text-lg font-bold mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-black text-lg font-bold mb-2">
              Confirm New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="w-1/3 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              BACK
            </button>
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              CHANGE PASSWORD
            </button>
          </div>
        </form>
      </div>
    </LoginLayout>
  );
};

export default InputNewPassword;

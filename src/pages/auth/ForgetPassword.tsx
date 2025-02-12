import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLayout from "../../layout/layoutLogin";
import loginImage from "../../assets/Tampilan Login.png";
import Swal from "sweetalert2";

const ForgetPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      Swal.fire({
        icon: "success",
        title: "email send successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
      setSubmitted(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Email is required",
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
        <h2 className="text-2xl font-bold mb-4">INPUT EMAIL</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-bold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/input-new-password")}
              className="w-1/3 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              BACK
            </button>
            {submitted ? (
              <button
                type="button"
                onClick={() => navigate("/auth/input-new-password")}
                className="w-1/3 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition duration-200"
              >
                NEXT
              </button>
            ) : (
              <button
                type="submit"
                className="w-1/3 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                SEND
              </button>
            )}
          </div>
        </form>
      </div>
    </LoginLayout>
  );
};

export default ForgetPage;

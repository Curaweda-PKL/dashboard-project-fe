import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginLayout from "../../layout/layoutLogin";
import loginImage from "../../assets/Tampilan Login.png";
import Swal from "sweetalert2";
import authApi from "../../component/api/authApi";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("logoutSuccess") === "true") {
      localStorage.removeItem("logoutSuccess");
      Swal.fire({
        icon: "success",
        title: "Logout successfully",
        background: "rgb(0, 208, 255)",
        color: "#000000",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { access_token, access_role } = await authApi.login({ email, password });
      
      // Store tokens and role
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("accessRole", access_role);
      localStorage.setItem("isLoggedIn", "true");

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        background: '#4CAF50',
        color: '#ffffff',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        timerProgressBar: true,
      });

      navigate("/dashboard");
    } catch (error) {
      // Show error notification
      Swal.fire({
        icon: 'error',
        title: error instanceof Error ? error.message : 'Login Failed',
        background: 'rgb(255, 72, 66)',
        color: '#ffffff',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgetPassword = () => {
    navigate("/forget-password");
  };

  return (
    <LoginLayout>
      {/* Left side: Image */}
      <div
        className="hidden lg:block lg:w-3/5 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Right side: Login Form */}
      <div className="flex items-center justify-center w-full lg:w-2/5 p-12 bg-white">
        <div className="w-full max-w-lg mr-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">LOGIN</h2>
          <form onSubmit={handleLogin} className="w-full">
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
                className="bg-white w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-lg font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
              <div className="text-sm text-gray-600 mt-1">
                <button 
                  type="button"
                  onClick={handleForgetPassword} 
                  className="text-blue-600 underline hover:text-blue-800"
                  disabled={isLoading}
                >
                  Forget Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-1/2 bg-curawedaColor text-white font-bold py-3 rounded-full hover:bg-[#029FCC] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LoginLayout>
  );
};

export default LoginPage;

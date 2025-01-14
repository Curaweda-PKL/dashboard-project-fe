import React, { useState, useEffect } from "react";
import LoginLayout from "../../layout/layoutLogin";
import loginImage from "../../assets/Tampilan Login.png";
import Swal from "sweetalert2"; // Import SweetAlert2

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("axyz@gmail");
  const [password, setPassword] = useState("password123");

  // Gunakan useEffect untuk menampilkan notifikasi setelah halaman login dimuat
  useEffect(() => {
    Swal.fire({
      icon: 'success',
      title: 'Logout successfully',
      background: 'rgb(0, 208, 255)',
      color: '#000000',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      timerProgressBar: true,
    });
  }, []); // Menjalankan sekali ketika halaman login dimuat

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Tambahkan logika autentikasi di sini
  };

  return (
    <LoginLayout>
      {/* Left side: Gambar */}
      <div
        className="hidden lg:block lg:w-3/5 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Right side: Form Login */}
      <div className="flex items-center justify-center w-full lg:w-2/5 p-12 bg-white">
        <div className="w-full max-w-lg mr-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">LOGIN</h2>
          <form onSubmit={handleSubmit} className="w-full">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-1/2 bg-[#02CCFF] text-white font-bold py-3 rounded-full hover:bg-[#029FCC] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </LoginLayout>
  );
};

export default LoginPage;

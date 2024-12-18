import React, { useState } from "react";
import LoginLayout from "../../layout/layoutLogin";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("axyz@gmail");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Tambahkan logika autentikasi di sini
  };

  return (
    <LoginLayout>
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email} // Default value langsung di state
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password} // Default value langsung di state
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          >
            LOGIN
          </button>
        </div>
      </form>
    </LoginLayout>
  );
};

export default LoginPage;

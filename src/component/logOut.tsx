import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk navigasi
import Swal from "sweetalert2"; // Import SweetAlert2

const LogOut: React.FC = () => {
  const navigate = useNavigate(); // Inisialisasi navigator

  useEffect(() => {
    // Menampilkan pop-up peringatan SweetAlert2 saat halaman pertama kali dimuat
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B20000",
      cancelButtonColor: "##6D6D6D",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengonfirmasi logout
        console.log("Logged out!");
        navigate("/auth/login"); // Arahkan ke halaman login
      } else {
        // Jika tombol Cancel ditekan, kembali ke halaman "My Account"
        console.log("Canceled logout");
        navigate("/settings"); // Arahkan ke halaman My Account (Home settings)
      }
    });
  }, [navigate]);

  return null; // Tidak ada UI yang ditampilkan, SweetAlert2 langsung muncul
};

export default LogOut;

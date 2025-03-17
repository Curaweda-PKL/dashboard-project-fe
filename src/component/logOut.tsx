import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LogOut: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B20000",
      cancelButtonColor: "#6D6D6D",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Logged out!");
        navigate("/auth/login");
      } else {
        console.log("Canceled logout");
        navigate("/settings");
      }
    });
  }, [navigate]);

  return null;
};

export default LogOut;

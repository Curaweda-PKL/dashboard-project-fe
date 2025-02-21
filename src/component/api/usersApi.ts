const BASE_URL = "http://localhost:8080/api"; // Sesuaikan dengan backend

export interface User {
  name: string;
  email: string;
}

async function fetchUsers(): Promise<User[]> {
  try {
    // Ambil token dari localStorage (pastikan token sudah disimpan sebelumnya)
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found!");
    }

    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Sertakan token pada header Authorization
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export default {
  fetchUsers,
};

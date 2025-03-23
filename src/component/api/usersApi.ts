import authApi from "./authApi";
import roleApi from "./roleApi"; // pastikan roleApi diekspor dengan fungsi getRole

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string; // role berupa nama, misalnya "superadmin", "project manager lead", "user"
}

// Fungsi helper untuk mengambil email dari token JWT
function getEmailFromToken(): string | null {
  const token = authApi.getAccessToken();
  if (!token) return null;
  try {
    // Token JWT biasanya memiliki tiga bagian yang dipisahkan oleh titik.
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    return payload.email || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

const usersApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: jika respons API dibungkus dalam properti "data", kembalikan nilainya
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Fungsi untuk mendapatkan user berdasarkan ID, kemudian sambungkan dengan data role dari role API
  async function getUser(userId: string): Promise<UserSummary> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/${userId}`);
      const data = processResponse(result);
      // Pastikan email yang ditampilkan adalah email dari token login
      const loginEmail = getEmailFromToken();
      data.email = loginEmail || data.email;
      // Jika properti role tidak ada, tetapkan nilai default "user"
      data.role = data.role || "user";
      console.log("Fetched user data:", data);
      
      // Mengambil data role dari role API tanpa parameter
      // Misalnya, roleApi.getRole() mengembalikan daftar role, lalu kita mencari role yang sesuai
      const roles = await roleApi.getRole();
      const roleDetail = roles.find((r: any) => r.name === data.role) || {};
      data.role = roleDetail.name || data.role;
      
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user"
      );
    }
  }

  // Fungsi untuk mendapatkan user saat ini (berdasarkan token JWT) dan sambungkan dengan data role
  async function getCurrentUser(): Promise<UserSummary> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/me`);
      const data = processResponse(result);
      // Override email dengan email dari token login
      const loginEmail = getEmailFromToken();
      data.email = loginEmail || data.email;
      // Jika properti role tidak ada, tetapkan nilai default "user"
      data.role = data.role || "user";
      console.log("Fetched current user data:", data);
      
      // Ambil detail role dari role API tanpa parameter
      const roles = await roleApi.getRole();
      const roleDetail = roles.find((r: any) => r.name === data.role) || {};
      data.role = roleDetail.name || data.role;
      
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch current user"
      );
    }
  }

  // Fungsi untuk mendapatkan user yang tersimpan di localStorage (jika ada)
  function getUserFromStorage(): UserSummary | null {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        // Override email dengan email dari token jika tersedia
        const loginEmail = getEmailFromToken();
        user.email = loginEmail || user.email;
        // Jika properti role tidak ada, tetapkan nilai default "user"
        user.role = user.role || "user";
        return user;
      } catch (error) {
        console.error("Error parsing user from storage:", error);
        return null;
      }
    }
    return null;
  }

  // Fungsi helper untuk mendapatkan current user dengan fallback ke data cached
  async function getCurrentUserWithFallback(): Promise<UserSummary | null> {
    const storedUser = getUserFromStorage();
    try {
      const freshUser = await getCurrentUser();
      localStorage.setItem("currentUser", JSON.stringify(freshUser));
      return freshUser;
    } catch (error) {
      console.error("Failed to fetch current user, using cached data if available", error);
      return storedUser;
    }
  }

  return {
    getUser,
    getCurrentUser,
    getUserFromStorage,
    getCurrentUserWithFallback,
  };
})();

export default usersApi;

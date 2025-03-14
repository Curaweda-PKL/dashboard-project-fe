import authApi from "./authApi";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  // Tambahkan field lain yang diperlukan
}

const usersApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: jika respons API dibungkus dalam properti "data", kembalikan nilainya
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Fungsi untuk mendapatkan user berdasarkan ID
  async function getUser(userId: string): Promise<UserSummary> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/${userId}`);
      const data = processResponse(result);
      console.log("Fetched user data:", data); // Tambahkan komen data
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user"
      );
    }
  }

  // Fungsi untuk mendapatkan user saat ini (berdasarkan token JWT)
  async function getCurrentUser(): Promise<UserSummary> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/me`);
      const data = processResponse(result);
      console.log("Fetched current user data:", data); // Tambahkan komen data
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
        return JSON.parse(userJson);
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


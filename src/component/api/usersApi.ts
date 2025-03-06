import authApi from "./authApi";

export interface UserSummary {
  name: string;
  email: string;
}

const usersApi = {
  getUserById: async (id: string): Promise<UserSummary> => {
    const url = `http://localhost:8080/api/users/${id}`;
    console.log("Fetching user from:", url);

    // Ambil token dari authApi
    const token = authApi.getAccessToken();
    if (!token) {
      throw new Error("Token tidak tersedia");
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        // Gunakan "omit" agar kredensial (misalnya cookies) tidak dikirim,
        // sehingga tidak terjadi konflik dengan header Access-Control-Allow-Origin dari server.
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data:", data);

      const { name, email } = data;
      return { name, email };
    } catch (error) {
      console.error("Error fetching user by id:", error);
      throw error;
    }
  },
};

export const fetchUser = usersApi.getUserById;
export default usersApi;

// src/api/usersApi.ts
import authApi from "./authApi";

export interface User {
  id: string;
  name: string;
  email: string;
}

// Helper untuk memproses response API
const processResponse = (jsonData: any) => {
  return jsonData.data ? jsonData.data : jsonData;
};

const usersApi = {
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await authApi._fetchWithAuth(`http://localhost:8080/api/users/${id}`, {
        // Bisa menambahkan header tambahan jika diperlukan,
        // tetapi "Content-Type" sudah di-set di authApi.ts.
      });
      const data = processResponse(response);
      return data;
    } catch (error) {
      console.error("Error fetching user by id:", error);
      throw error;
    }
  },
};

export const fetchUser = usersApi.getUserById;
export default usersApi;

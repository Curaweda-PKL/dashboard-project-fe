import authApi from "./authApi";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_pic?: string;
  created_at?: Date;
  updated_at?: Date;
  user_roles?: {
    roles: {
      id: string;
      name: string;
    };
  }[];
  user_permissions?: {
    permissions: {
      id: string;
      name: string;
    };
  }[];
}

const userProfileApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: Unwrap data jika backend membungkusnya di properti "data"
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Fungsi untuk mengonversi string tanggal ke Date (jika tersedia)
  const parseDate = (dateStr: string | undefined): Date | undefined => {
    return dateStr ? new Date(dateStr) : undefined;
  };

  // Map respons backend ke interface UserProfile
  const mapUserProfile = (profile: any): UserProfile => ({
    ...profile,
    created_at: parseDate(profile.created_at),
    updated_at: parseDate(profile.updated_at),
  });

  // Fungsi untuk mendapatkan profil user berdasarkan userId yang tersimpan di localStorage
  async function getUserProfile(): Promise<UserProfile> {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/${userId}`);
      const data = processResponse(result);
      return mapUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  // Fungsi untuk memperbarui profil user menggunakan metode PATCH
  async function updateUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = processResponse(result);
      return mapUserProfile(data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Fungsi untuk mengunggah gambar profil menggunakan FormData
  async function uploadProfilePicture(file: File): Promise<{ profile_pic: string }> {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const formData = new FormData();
      formData.append("profile_pic", file);
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/upload-profile-pic/${userId}`, {
        method: "POST",
        body: formData,
      });
      return processResponse(result);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }

  // Helper function untuk mengambil dan menyimpan user ID dari endpoint /users/me
  async function fetchAndStoreCurrentUser(): Promise<string> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/me`);
      const data = processResponse(result);
      const userId = data.id;
      if (userId) {
        localStorage.setItem("userId", userId);
      }
      return userId;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  return {
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    fetchAndStoreCurrentUser,
  };
})();

export default userProfileApi;

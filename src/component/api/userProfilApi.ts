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

  const processResponse = async (response: Response) => {
    if (!response || !(response instanceof Response)) {
      throw new Error("Invalid response from server (not a Response object)");
    }
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    try {
      const text = await response.text();
      console.log("Raw response text:", text);
      return text ? JSON.parse(text) : {};
    } catch (error) {
      throw new Error("Failed to parse JSON response");
    }
  };

  const parseDate = (dateStr: string | undefined): Date | undefined => {
    return dateStr ? new Date(dateStr) : undefined;
  };

  const mapUserProfile = (profile: any): UserProfile => ({
    ...profile,
    created_at: parseDate(profile.created_at),
    updated_at: parseDate(profile.updated_at),
  });

  async function getUserProfile(): Promise<UserProfile> {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/${userId}`);
      const data = await processResponse(result);
      return mapUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  async function updateUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await processResponse(result);
      return mapUserProfile(data);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  async function uploadProfilePicture(file: File): Promise<{ profile_pic: string }> {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }
      const formData = new FormData();
      formData.append("profile_pic", file);
      const result = await authApi._fetchWithAuth(`${BASE_URL}/users/${userId}/upload`, {
        method: "POST",
        body: formData,
      });
      return await processResponse(result);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }

  async function fetchAndStoreCurrentUser(): Promise<string> {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/users`);
      const data = await processResponse(response);
      console.log("Parsed response:", data);
      
      if (!data || typeof data !== "object" || !data.result || !Array.isArray(data.result)) {
        throw new Error("Invalid user data structure in response");
      }
      
      const user = data.result[0];
      if (!user || !user.id) {
        throw new Error("User ID not found in response");
      }
      
      localStorage.setItem("userId", user.id);
      return user.id;
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

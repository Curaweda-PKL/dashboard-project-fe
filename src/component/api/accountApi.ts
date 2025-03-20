import authApi from "./authApi";

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  phone_number?: string; // Added phone_number field
  created_at?: string;
  update_at?: string;
  user_roles?: { roles: { id: number; name: string } }[];
  user_permissions?: { permissions: { id: number; name: string } }[];
}

const BASE_URL = "http://localhost:8080/api/users";

// Fungsi untuk memproses respons dari server
async function processResponse(response: any): Promise<any> {
  console.log("Processing response:", response);
  console.log("Response type:", typeof response);

  if (!response) {
    throw new Error("Empty response received from server");
  }

  // Jika respons mengandung error, langsung lempar error tersebut
  if (response.error) {
    console.error("Server returned error:", response.error);
    throw new Error(`Error ${response.error.code}: ${response.error.message}`);
  }
  if (response.errors && response.errors.error) {
    console.error("Server returned errors:", response.errors.error);
    throw new Error(`Error ${response.errors.error.code}: ${response.errors.error.message}`);
  }

  // Jika respons merupakan promise, tunggu hingga selesai
  if (response instanceof Promise) {
    try {
      const resolvedResponse = await response;
      return processResponse(resolvedResponse);
    } catch (err) {
      console.error("Error resolving response promise:", err);
      throw new Error("Failed to process response promise");
    }
  }

  // Jika respons sudah berupa data user yang valid
  if (response.id && (response.name || response.email)) {
    return response;
  }

  // Coba ekstrak status HTTP dari respons
  let httpStatus = null;
  if (typeof response.status === "number") {
    httpStatus = response.status;
  } else if (typeof response.code === "number") {
    httpStatus = response.code;
  } else if (response.status && typeof response.status.code === "number") {
    httpStatus = response.status.code;
  } else if (response.statusCode && typeof response.statusCode === "number") {
    httpStatus = response.statusCode;
  }

  if (httpStatus === null) {
    throw new Error("Invalid response received from server");
  }

  if (httpStatus < 200 || httpStatus >= 300) {
    const errorText = response.message || response.error || "Unknown error";
    throw new Error(`Request failed with status: ${httpStatus} ${errorText}`);
  }

  return response.data ?? response.result ?? response.user ?? response.body ?? response;
}

// Mendapatkan data user berdasarkan ID
async function getUser(userId: number): Promise<UserSummary> {
  try {
    const response = await authApi._fetchWithAuth(`${BASE_URL}/${userId}`, {
      headers: { "Accept": "application/json" },
    });
    return await processResponse(response);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user");
  }
}

// Mendapatkan daftar semua user
async function getUsers(): Promise<UserSummary[]> {
  try {
    const response = await authApi._fetchWithAuth(`${BASE_URL}`, {
      headers: { "Accept": "application/json" },
    });
    const processed = await processResponse(response);
    if (Array.isArray(processed)) {
      return processed;
    } else if (typeof processed === "object") {
      return processed.result ?? processed.users ?? processed.data ?? processed.results ?? [];
    }
    return [];
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch users");
  }
}

async function getAllUser(): Promise<UserSummary[]> {
  return await getUsers();
}

// Membuat user baru
async function createUser(
  userData: Partial<UserSummary> & { password?: string; role?: string; permission?: string; phone_number?: string }
): Promise<UserSummary> {
  try {
    const roles = userData.role ? [userData.role] : [];
    const permissions = userData.permission ? [userData.permission] : [];
    const { role, permission, ...userDataWithoutRolePermission } = userData;
    const formattedUserData = {
      ...userDataWithoutRolePermission,
      roles,
      permissions,
    };

    console.log("Creating user with data:", formattedUserData);

    const response = await authApi._fetchWithAuth(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formattedUserData),
    });

    return await processResponse(response);
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create user");
  }
}

// Fungsi updateUser yang sudah diperbaiki dengan support untuk phone_number
async function updateUser(
  userId: number,
  userData: Partial<UserSummary> & { password?: string; role?: string; permission?: string; phone_number?: string }
): Promise<UserSummary> {
  try {
    // Buat objek baru untuk data yang akan diupdate
    const updatedData: any = {};
    
    // Hanya tambahkan field yang ada nilainya
    if (userData.name !== undefined) updatedData.name = userData.name;
    if (userData.email !== undefined) updatedData.email = userData.email;
    if (userData.phone_number !== undefined) updatedData.phone_number = userData.phone_number;
    
    // Hanya sertakan password jika ada nilai dan bukan string kosong
    if (userData.password && userData.password.trim() !== "") {
      updatedData.password = userData.password;
    }
    
    // Format roles dan permissions sebagai array sesuai yang diharapkan backend
    if (userData.role !== undefined) {
      updatedData.roles = userData.role ? [userData.role] : [];
    }
    if (userData.permission !== undefined) {
      updatedData.permissions = userData.permission ? [userData.permission] : [];
    }

    console.log(`Updating user ${userId} with data:`, updatedData);

    const endpoint = `${BASE_URL}/update/${userId}`;
    const response = await authApi._fetchWithAuth(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    console.log("Raw update response:", response);
    const data = await processResponse(response);
    console.log(`User ${userId} updated successfully:`, data);
    return data;
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    throw new Error(error instanceof Error ? error.message : "Failed to update user");
  }
}

// Fungsi untuk memperbarui nomor telepon user
async function updatePhoneNumber(userId: number, phoneNumber: string): Promise<UserSummary> {
  try {
    return await updateUser(userId, { phone_number: phoneNumber });
  } catch (error: any) {
    console.error(`Error updating phone number for user ${userId}:`, error);
    throw new Error(error instanceof Error ? error.message : "Failed to update phone number");
  }
}

// Menghapus user berdasarkan ID
async function deleteUser(userId: number): Promise<void> {
  try {
    const response = await authApi._fetchWithAuth(`${BASE_URL}/delete/${userId}`, {
      method: "DELETE",
      headers: { "Accept": "application/json" },
    });
    await processResponse(response);
  } catch (error: any) {
    console.error(`Error deleting user ${userId}:`, error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete user");
  }
}

// Menguji koneksi API
async function testApiConnection(): Promise<boolean> {
  try {
    const response = await authApi._fetchWithAuth(`${BASE_URL}/test-connection`, {
      headers: { "Accept": "application/json" },
    });
    await processResponse(response);
    return true;
  } catch (error: any) {
    console.error("Test connection failed:", error);
    return false;
  }
}

const accountApi = {
  getUser,
  getUsers,
  getAllUser,
  createUser,
  updateUser,
  updatePhoneNumber,
  deleteUser,
  testApiConnection,
};

export default accountApi;
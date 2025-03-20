import authApi from "./authApi";

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  created_at?: string;
  update_at?: string;
  user_roles?: { roles: { id: number; name: string } }[];
  user_permissions?: { permissions: { id: number; name: string } }[];
}

const BASE_URL = "http://localhost:8080/api/users";

// Fungsi untuk memproses respons dari server dengan format yang konsisten
async function processResponse(response: any): Promise<any> {
  console.log("Processing response:", response);
  console.log("Response type:", typeof response);

  if (!response) {
    throw new Error("Empty response received from server");
  }

  // Tangani error jika ada di response
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

  // Jika data dikemas dalam properti tertentu, ambil data tersebut
  return response.data ?? response.result ?? response.user ?? response.body ?? response;
}

// Fungsi untuk mengekstrak user ID dari token JWT (sesuaikan jika perlu)
function extractUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.warn("Token does not have 3 parts, not a valid JWT");
      return null;
    }
    const payload = JSON.parse(atob(tokenParts[1]));
    // Sesuaikan field berikut dengan struktur token JWT Anda
    const userId = payload.userId || payload.user_id || payload.sub || payload.id || null;
    return userId;
  } catch (error) {
    console.error("Failed to extract user ID from token:", error);
    return null;
  }
}

// Mendapatkan data user saat ini menggunakan endpoint /me dengan fallback ke GET /{id}
async function getCurrentUser(): Promise<UserSummary> {
  try {
    console.log("Fetching current user via /me...");
    const response = await authApi._fetchWithAuth(`${BASE_URL}/me`, {
      headers: { "Accept": "application/json" },
    });
    return await processResponse(response);
  } catch (error) {
    console.error("Error fetching current user via /me:", error);
    // Jika terjadi error, coba fallback dengan mengambil ID dari token
    const token = authApi.getAccessToken();
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      throw new Error("Failed to extract user ID from token");
    }
    console.log(`Fallback: fetching current user via /${userId}...`);
    const fallbackResponse = await authApi._fetchWithAuth(`${BASE_URL}/${userId}`, {
      headers: { "Accept": "application/json" },
    });
    return await processResponse(fallbackResponse);
  }
}

// Fungsi updateUser untuk mengupdate data user (email, phone_number, password, dll)
async function updateUser(
  userData: Partial<UserSummary> & { password?: string; role?: string; permission?: string }
): Promise<UserSummary> {
  try {
    // Siapkan payload update hanya dengan field yang didefinisikan
    const updatedData: any = {};
    if (userData.name !== undefined) updatedData.name = userData.name;
    if (userData.email !== undefined) updatedData.email = userData.email;
    if (userData.phone_number !== undefined) updatedData.phone_number = userData.phone_number;
    if (userData.password && userData.password.trim() !== "") {
      updatedData.password = userData.password;
    }
    if (userData.role !== undefined) {
      updatedData.roles = userData.role ? [userData.role] : [];
    }
    if (userData.permission !== undefined) {
      updatedData.permissions = userData.permission ? [userData.permission] : [];
    }

    console.log("Payload yang dikirim untuk update:", updatedData);

    // Ambil data user saat ini untuk mendapatkan ID
    const currentUser = await getCurrentUser();
    const endpoint = `${BASE_URL}/update/${currentUser.id}`;
    console.log(`Mengirim PATCH request ke ${endpoint} dengan payload:`, updatedData);

    const response = await authApi._fetchWithAuth(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    console.log("Response mentah dari update:", response);
    const data = await processResponse(response);
    console.log("User berhasil diupdate:", data);
    return data;
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update user");
  }
}

// Fungsi untuk memperbarui nomor telepon
async function updatePhoneNumber(phoneNumber: string): Promise<UserSummary> {
  try {
    return await updateUser({ phone_number: phoneNumber });
  } catch (error: any) {
    console.error("Error updating phone number:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update phone number");
  }
}

// Fungsi untuk memperbarui email
async function updateEmail(email: string): Promise<UserSummary> {
  try {
    return await updateUser({ email: email });
  } catch (error: any) {
    console.error("Error updating email:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update email");
  }
}

// Fungsi untuk memperbarui password; hanya mengirim newPassword karena currentPassword tidak digunakan
async function changePassword(newPassword: string): Promise<boolean> {
  try {
    await updateUser({ password: newPassword });
    return true;
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update password");
  }
}

// Fungsi untuk menguji koneksi API
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

const myAccountApi = {
  getCurrentUser,
  updateUser,
  updatePhoneNumber,
  updateEmail,
  changePassword,
  testApiConnection,
};

export default myAccountApi;

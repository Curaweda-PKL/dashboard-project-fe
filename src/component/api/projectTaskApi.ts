// projectTaskApi.ts
// Pastikan endpoint ini sesuai dengan routing backend Anda
const BASE_URL = "http://localhost:8080/api";

// Definisikan tipe Task (sesuaikan dengan data API)
export interface Task {
  id?: number;
  module: string;
  weight: number;
  totalWeight: number;
  percent: number;
  assignees: string[];
  deadline?: string;
  // properti tambahan jika ada...
}

/**
 * Helper untuk menangani response API.
 * Jika response memiliki properti "data", kembalikan data tersebut,
 * jika tidak, kembalikan JSON secara langsung.
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorRes = await response.json().catch(() => ({}));
    throw new Error(errorRes.message || "API request failed");
  }
  const jsonData = await response.json();
  if ("data" in jsonData) {
    return jsonData.data as T;
  }
  return jsonData as T;
};

/**
 * Mengambil semua project task dengan dukungan pagination dan pencarian.
 * @param params Parameter query, misalnya { page: 0, limit: 10, search: "" }
 * @returns {Promise<Task[]>} - Array task dari API.
 */
export const getAllProjectTasks = async ({
  page = 0,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<Task[]> => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found! Please login.");
    }

    const queryString = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const response = await fetch(`${BASE_URL}/projects/1?${queryString}`, {
      headers,
    });

    const result = await handleResponse<any>(response);
    if (Array.isArray(result)) {
      return result;
    }
    if (result && Array.isArray(result.result)) {
      return result.result;
    }
    if (result && Array.isArray(result.data)) {
      return result.data;
    }
    console.error("Unexpected format of response:", result);
    return [];
  } catch (error) {
    throw error;
  }
};

/**
 * Mengambil project task berdasarkan ID.
 */
export const getProjectTaskById = async (id: number): Promise<Task> => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found! Please login.");
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    const response = await fetch(`${BASE_URL}/${id}`, { headers });
    return await handleResponse<Task>(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Membuat project task baru.
 */
export const createProjectTask = async (taskData: Omit<Task, "id">): Promise<Task> => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found! Please login.");
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers,
      body: JSON.stringify(taskData),
    });
    return await handleResponse<Task>(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Memperbarui project task berdasarkan ID.
 */
export const updateProjectTask = async (
  id: number,
  taskData: Partial<Task>
): Promise<Task> => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found! Please login.");
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(taskData),
    });
    return await handleResponse<Task>(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Menghapus project task berdasarkan ID.
 */
export const deleteProjectTask = async (id: number): Promise<Object> => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No auth token found! Please login.");
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers,
    });
    return await handleResponse<Object>(response);
  } catch (error) {
    throw error;
  }
};

export default {
  getAllProjectTasks,
  getProjectTaskById,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
};

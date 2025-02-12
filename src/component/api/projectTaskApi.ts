// projectTaskApi.ts
// Pastikan endpoint ini sesuai dengan routing backend Anda
const BASE_URL = "http://localhost:8080/api/project-tasks";

// Definisikan tipe Task (sesuaikan dengan data API)
export interface Task {
  id?: number;
  module: string;
  weight: number;
  totalWeight: number;
  percent: number;
  assignees: string[];
  deadline: string;
  // properti tambahan jika ada...
}

/**
 * Helper untuk menangani response API.
 * Jika response memiliki properti data, kembalikan data tersebut,
 * jika tidak, kembalikan JSON secara langsung.
 */
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorRes = await response.json().catch(() => ({}));
    throw new Error(errorRes.message || "API request failed");
  }
  const jsonData = await response.json();
  return jsonData.data ? jsonData.data : jsonData;
}

/**
 * Mengambil semua project task dengan dukungan pagination dan pencarian.
 * @param params Parameter query, misalnya { page: 0, limit: 10, search: "" }
 * @returns {Promise<Task[]>} - Array task dari API.
 */
async function getAllProjectTasks({
  page = 0,
  limit = 10,
  search = "",
} = {}): Promise<Task[]> {
  try {
    const queryString = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    const response = await fetch(`${BASE_URL}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Mengambil project task berdasarkan ID.
 */
async function getProjectTaskById(id: number): Promise<Task> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Membuat project task baru.
 */
async function createProjectTask(taskData: Object): Promise<Task> {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Memperbarui project task berdasarkan ID.
 */
async function updateProjectTask(id: number, taskData: Object): Promise<Task> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Menghapus project task berdasarkan ID.
 */
async function deleteProjectTask(id: number): Promise<Object> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
}

export default {
  getAllProjectTasks,
  getProjectTaskById,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
};

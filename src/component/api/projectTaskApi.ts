// projectTaskApi.ts
import authApi from "./authApi";

// Tipe detail
export interface TaskDetail {
  module: string;
  weight: number;
  feature: string;
  task: string;
  percentage: number;
  status: string;
}

// Tipe projectTask
export interface ProjectTask {
  id?: number;
  project_id?: number;
  created_at?: string;
  updated_at?: string;
  // di-backend snake_case => "task_details"
  task_details?: TaskDetail[];

  projectName?: string;
  pic?: string;
  date?: string;
  client?: string;
}

const API_BASE_URL = "http://localhost:8080/api";

// Helper untuk authorization
const getAuthHeaders = () => {
  const token = authApi.getAccessToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const projectTaskApi = {
  // Ambil semua tasks dari backend
  getAllProjectTasks: async (projectId: number): Promise<ProjectTask[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/task`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("getAllProjectTasks => raw result:", result);

    // Cek apakah data di-wrapping oleh "data" atau "data.result"
    // Sesuaikan dengan struktur response Anda
    // Misalnya, jika response-nya:
    // {
    //   "message": "Project tasks successfully retrieved!",
    //   "data": {
    //       "result": [ ...arrayOfTasks ],
    //       "page": 0,
    //       ...
    //   }
    // }
    // maka kita ambil result.data.result

    if (result?.data?.result) {
      return result.data.result; // array of ProjectTask
    } else if (Array.isArray(result)) {
      // Kalau ternyata langsung array
      return result;
    } else if (Array.isArray(result?.data)) {
      // Kalau data langsung array
      return result.data;
    }

    // Jika format tidak sesuai, kembalikan array kosong
    return [];
  },

  // Create project task
  // Payload-nya kita kirim "taskDetails" agar backend simpan di projectTaskDetail
  createProjectTask: async (
    payload: { taskDetails: TaskDetail[] },
    projectId: number
  ): Promise<ProjectTask> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/task`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const createdTask = await response.json();
    console.log("createProjectTask => createdTask:", createdTask);

    // Kalau backend membungkus data di result.data, tangani di sini juga
    // Misal:
    // {
    //   "message": "Project task successfully created!",
    //   "data": {
    //       "id": ...,
    //       "project_id": ...,
    //       "task_details": [ ... ]
    //   }
    // }
    if (createdTask?.data) {
      return createdTask.data;
    }
    return createdTask;
  },

  updateTaskDetail: async (projectId: number, detailId: number, payload: TaskDetail): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/task-detail/${detailId}`, {
      method: "PUT", // atau PATCH sesuai API Anda
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  },
  

  // Hapus project task (opsional)
  deleteTaskDetail: async (projectId: number, detailId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/task-detail/${detailId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  },
  
};

export default projectTaskApi;

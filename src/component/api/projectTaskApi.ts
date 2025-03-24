import authApi from "./authApi";

// Tipe detail
export interface TaskDetail {
  module: string;
  feature: string;
  start_date: Date;
  end_date: Date;
  status: string;
  pic?: number | null; // Diubah menjadi number sesuai tipe di backend
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
  pic?: number;
  erd_number?: string;
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

    if (result?.data?.result) {
      return result.data.result;
    } else if (Array.isArray(result)) {
      return result;
    } else if (Array.isArray(result?.data)) {
      return result.data;
    }

    return [];
  },

  // Create project task
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

    if (createdTask?.data) {
      return createdTask.data;
    }
    return createdTask;
  },

  updateTaskDetail: async (projectId: number, detailId: number, payload: TaskDetail): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/task-detail/${detailId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  },

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

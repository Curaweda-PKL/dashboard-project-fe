import authApi from "./authApi"; 

export interface Task {
  id?: number;
  module: string;
  weight: number;
  totalWeight: number;
  percent: number;
  assignees: string[];
  deadline: string;
  created_at?: string;
  updated_at?: string;
  showAssigneesDropdown?: boolean;
}

const API_BASE_URL = "http://localhost:8080/api";

// Helper function to get headers with authorization
const getAuthHeaders = () => {
  const token = authApi.getAccessToken();
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const projectTaskApi = {
  // Fetch all project tasks
  getAllProjectTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/1`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (!result) {
        console.error("Empty response from API");
        return [];
      }

      if (result.errors) {
        console.error("API returned errors:", result.errors);
        throw new Error("API error: " + JSON.stringify(result.errors));
      }

      if (Array.isArray(result)) {
        return result;
      }

      if (result.data && Array.isArray(result.data)) {
        return result.data;
      }

      console.error("Unexpected response format:", result);
      return [];
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      throw error;
    }
  },

  // projectTaskApi.ts
  getTasksByProjectId: async (projectId: number): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/task`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      return result.data ? result.data : result;
    } catch (error) {
      console.error("Error fetching tasks for project", projectId, error);
      throw error;
    }
  },


  // Create a new project task
  // Create a new project task
createProjectTask: async (task: Task): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/1`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const createdTask = await response.json();
    console.log("Project task successfully created:", createdTask); 
    return createdTask;
  } catch (error) {
    console.error("Error creating project task:", error);
    throw error;
  }
},


  // Update an existing project task
  updateProjectTask: async (id: number, task: Task): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/1/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating project task with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a project task
  deleteProjectTask: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/1/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error deleting project task with id ${id}:`, error);
      throw error;
    }
  },
};

export default projectTaskApi;

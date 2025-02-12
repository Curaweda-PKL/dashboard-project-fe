import authApi from "./authApi";

// Types untuk TypeScript
export interface Project {
  id?: number;
  title: string;
  start_date: Date;
  end_date: Date;
  description: string;
  status: string;
  pic_id: number;
  contract_number?: string;
  erd_number?: string;
  client?: string;
  created_at?: Date;
  updated_at?: Date;
}

const projectApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Fungsi untuk menangani response API
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "API request failed");
    }
    // Jika API mengembalikan { data: [...] } gunakan jsonData.data
    const jsonData = await response.json();
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Fungsi untuk memformat tanggal untuk API (misalnya YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    if (typeof date === "string") return date;
    return date.toISOString().split("T")[0];
  };

  async function getAllProjects(): Promise<Project[]> {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects`);
      const data = await handleResponse(response);
      return data.map((project: Project) => ({
        ...project,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        created_at: project.created_at ? new Date(project.created_at) : undefined,
        updated_at: project.updated_at ? new Date(project.updated_at) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch projects"
      );
    }
  }

  async function getProjectById(id: number): Promise<Project> {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`);
      const data = await handleResponse(response);
      return {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
      };
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch project"
      );
    }
  }

  async function createProject(
    projectData: Omit<Project, "id" | "created_at" | "updated_at">
  ): Promise<Project> {
    try {
      const formattedData = {
        ...projectData,
        start_date: formatDateForAPI(projectData.start_date),
        end_date: formatDateForAPI(projectData.end_date),
      };

      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await handleResponse(response);
      return {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
      };
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create project"
      );
    }
  }

  async function updateProject(
    id: number,
    projectData: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
  ): Promise<Project> {
    try {
      const formattedData = {
        ...projectData,
        start_date: projectData.start_date
          ? formatDateForAPI(projectData.start_date)
          : undefined,
        end_date: projectData.end_date
          ? formatDateForAPI(projectData.end_date)
          : undefined,
      };

      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const data = await handleResponse(response);
      return {
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
      };
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update project"
      );
    }
  }

  async function deleteProject(id: number): Promise<void> {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
        method: "DELETE",
      });
      await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    }
  }

  async function getProjectsByStatus(status: string): Promise<Project[]> {
    try {
      const response = await authApi._fetchWithAuth(
        `${BASE_URL}/projects/status/${status}`
      );
      const data = await handleResponse(response);
      return data.map((project: Project) => ({
        ...project,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        created_at: project.created_at ? new Date(project.created_at) : undefined,
        updated_at: project.updated_at ? new Date(project.updated_at) : undefined,
      }));
    } catch (error) {
      console.error(`Error fetching projects with status ${status}:`, error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch projects by status"
      );
    }
  }

  async function getProjectsByPIC(picId: number): Promise<Project[]> {
    try {
      const response = await authApi._fetchWithAuth(
        `${BASE_URL}/projects/pic/${picId}`
      );
      const data = await handleResponse(response);
      return data.map((project: Project) => ({
        ...project,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        created_at: project.created_at ? new Date(project.created_at) : undefined,
        updated_at: project.updated_at ? new Date(project.updated_at) : undefined,
      }));
    } catch (error) {
      console.error(`Error fetching projects for PIC ${picId}:`, error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch projects by PIC"
      );
    }
  }

  return {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getProjectsByPIC,
  };
})();

export default projectApi;

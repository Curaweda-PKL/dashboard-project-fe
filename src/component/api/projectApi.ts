import authApi from "./authApi";

// Types untuk TypeScript
export interface Project {
  id?: number;
  title: string;
  duration: number; // jumlah hari sebagai number
  description: string;
  status: string;
  pic_id?: number | null;
  contract_number?: string;
  erd_number?: string;
  client?: string;
  progress?: number;
  created_at?: Date;
  updated_at?: Date;
}

const projectApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: Unwrap data jika backend membungkusnya dalam properti "data"
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Map response dari backend ke dalam interface Project
  const mapProject = (project: any): Project => ({
    ...project,
    duration: project.duration,
    created_at: project.created_at ? new Date(project.created_at) : undefined,
    updated_at: project.updated_at ? new Date(project.updated_at) : undefined,
    pic_id: project.pic ? project.pic.id : project.pic_id,
    contract_number: project.contract_number,
    erd_number: project.erd_number,
    client: project.client,
  });

  async function getAllProjects(): Promise<Project[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects`);
      const data = processResponse(result);
      console.log("Data fetched from API:", data);
      // Jika data berupa array atau terdapat properti "result"
      const projectsArray = Array.isArray(data)
        ? data
        : data.result && Array.isArray(data.result)
        ? data.result
        : [];
      return projectsArray.map((project: any) => mapProject(project));
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch projects"
      );
    }
  }
  
  async function getProjectById(id: number): Promise<Project> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`);
      const data = processResponse(result);
      return mapProject(data);
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
        duration: Number(projectData.duration),
        // Jika pic_id adalah falsy (""), kirim null
        pic_id: projectData.pic_id ? Number(projectData.pic_id) : null,
      };

      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = processResponse(result);
      const project = data.project ? data.project : data;
      return mapProject(project);
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
        duration:
          projectData.duration !== undefined
            ? Number(projectData.duration)
            : undefined,
        pic_id:
          projectData.pic_id !== undefined
            ? projectData.pic_id
              ? Number(projectData.pic_id)
              : null
            : undefined,
      };
  
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const data = processResponse(result);
      return mapProject(data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update project"
      );
    }
  }
  
  async function deleteProject(id: number): Promise<void> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/delete/${id}`, {
        method: "DELETE",
      });
      processResponse(result);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    }
  }

  async function getProjectsByStatus(status: string): Promise<Project[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/status/${status}`);
      const data = processResponse(result);
      return data.map((project: any) => mapProject(project));
    } catch (error) {
      console.error(`Error fetching projects with status ${status}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch projects by status"
      );
    }
  }

  async function getProjectsByPIC(picId: number): Promise<Project[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/pic/${picId}`);
      const data = processResponse(result);
      return data.map((project: any) => mapProject(project));
    } catch (error) {
      console.error(`Error fetching projects for PIC ${picId}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch projects by PIC"
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

import authApi from "./authApi";

// Types untuk TypeScript
export interface Project {
  id?: number;
  title: string;
  start_date: Date;
  end_date: Date;
  description: string;
  status: string;
  pic_id?: number;
  contract_number?: string;
  erd_number?: string;
  client?: string;
  created_at?: Date;
  updated_at?: Date;
}

const projectApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // This helper unwraps the data if the backend wraps it in a "data" property.
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Convert a Date into a full ISO datetime string
  const formatDateForAPI = (date: Date) => {
    if (typeof date === "string") return date;
    return date.toISOString();
  };

  // Map the backend project response to our Project interface.
  const mapProject = (project: any): Project => ({
    ...project,
    start_date: new Date(project.start_date),
    end_date: new Date(project.end_date),
    created_at: project.created_at ? new Date(project.created_at) : undefined,
    updated_at: project.updated_at ? new Date(project.updated_at) : undefined,
    pic_id: project.pic ? project.pic.id : project.pic_id,
  });

  async function getAllProjects(): Promise<Project[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects`);
      const data = processResponse(result);
      console.log("Data fetched from API:", data);
      // If the returned data is not an array but an object that contains a "result" property, use that array.
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
        start_date: formatDateForAPI(projectData.start_date),
        end_date: formatDateForAPI(projectData.end_date),
      };

      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = processResponse(result);
      // If backend returns an object with a "project" property, extract it.
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
        start_date: projectData.start_date ? formatDateForAPI(projectData.start_date) : undefined,
        end_date: projectData.end_date ? formatDateForAPI(projectData.end_date) : undefined,
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
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
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

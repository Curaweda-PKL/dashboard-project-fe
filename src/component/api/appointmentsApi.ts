import authApi from "./authApi";

// Interface hanya dengan properti yang diperlukan
export interface ProjectSummary {
  title: string;
  start_date: Date;
  end_date: Date;
}

const appointmentsApi = (() => { 
  const BASE_URL = "http://localhost:8080/api";

  // Helper untuk meng-unwrapping data jika backend membungkusnya dalam properti "data".
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Mapping response dari backend ke interface ProjectSummary
  const mapProject = (project: any): ProjectSummary => ({
    title: project.title,
    start_date: new Date(project.start_date),
    end_date: new Date(project.end_date)
  });

  async function getAllProjects(): Promise<ProjectSummary[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects`);
      const data = processResponse(result);
      console.log("Data fetched from API:", data);
      // Jika data tidak berbentuk array tetapi merupakan objek dengan properti "result", gunakan array tersebut.
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
  
  async function getProjectById(id: number): Promise<ProjectSummary> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`);
      const data = processResponse(result);
      console.log(`Data fetched from API for project ${id}:`, data);
      return mapProject(data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch project"
      );
    }
  }

  async function updateProject(
    id: number,
    projectData: Partial<ProjectSummary>
  ): Promise<ProjectSummary> {
    try {
      const formattedData = {
        ...projectData,
        start_date: projectData.start_date ? projectData.start_date.toISOString() : undefined,
        end_date: projectData.end_date ? projectData.end_date.toISOString() : undefined,
      };

      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      const data = processResponse(result);
      console.log(`Data updated for project ${id}:`, data);
      return mapProject(data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update project"
      );
    }
  }

  async function getProjectsByStatus(status: string): Promise<ProjectSummary[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/status/${status}`);
      const data = processResponse(result);
      console.log(`Data fetched from API for projects with status ${status}:`, data);
      return data.map((project: any) => mapProject(project));
    } catch (error) {
      console.error(`Error fetching projects with status ${status}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch projects by status"
      );
    }
  }

  async function getProjectsByPIC(picId: number): Promise<ProjectSummary[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/pic/${picId}`);
      const data = processResponse(result);
      console.log(`Data fetched from API for projects with PIC ${picId}:`, data);
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
    updateProject,
    getProjectsByStatus,
    getProjectsByPIC,
  };
})();

export default appointmentsApi;

// Tambahkan alias agar file Demo dapat mengimpor fetchProjectSummary
export const fetchProjectSummary = appointmentsApi.getAllProjects;


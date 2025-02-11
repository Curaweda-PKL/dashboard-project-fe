import authApi from './authApi';

const projectApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  async function getAllProjects() {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects`);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects');
    }
  }

  async function getProjectById(id: number) {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch project');
    }
  }

  async function createProject(projectData: {
    title: string;
    start_date: Date;
    end_date: Date;
    description: string;
    status: string;
    pic_id: number;
  }) {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create project');
    }
  }

  async function updateProject(
    id: number,
    projectData: {
      title?: string;
      start_date?: Date;
      end_date?: Date;
      description?: string;
      status?: string;
      pic_id?: number;
    }
  ) {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update project');
    }
  }

  async function deleteProject(id: number) {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete project');
    }
  }

  // Function to get projects by status
  async function getProjectsByStatus(status: string) {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects by status');
    }
  }

  // Function to get projects by PIC (Person In Charge)
  async function getProjectsByPIC(picId: number) {
    try {
      const response = await authApi._fetchWithAuth(`${BASE_URL}/projects/pic/${picId}`);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects by PIC');
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

// Types for TypeScript
export interface Project {
  id?: number;
  title: string;
  start_date: Date;
  end_date: Date;
  description: string;
  status: string;
  pic_id: number;
  created_at?: Date;
  updated_at?: Date;
}
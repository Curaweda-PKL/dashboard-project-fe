// summaryServiceAPI.ts
import authApi from "./authApi";

// Tambahkan interface ProjectDetail (jika diperlukan di file lain)
export interface ProjectDetail {
  projectName: string;
  pm: string;
  date: string;
  client: string;
}

// Tipe detail summary (menyesuaikan dengan format backend)
export interface SummaryDetail {
  id?: number;
  summary_id: number;
  module: string;
  case_field: string;
  causes: string;
  action: string;
  assignees: string[];
  deadline: string;
  status: string;
  close_date: string | null;
}

// Tipe project summary
export interface ProjectSummary {
  id: number;
  project_id: number;
  details: SummaryDetail[];
}

// Tipe response summary (untuk paging)
export interface ProjectSummaryResponse {
  result: ProjectSummary[];
  page: number;
  limit: number;
  total_rows: number;
  total_page: number;
}

const API_BASE_URL = "http://localhost:8080/api/projects";

// Helper untuk mendapatkan headers dengan autentikasi
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

// Helper untuk mengubah data summary dari backend ke format yang digunakan di frontend
const mapBackendToProjectSummary = (backendData: any): ProjectSummary => {
  if (!backendData) return {} as ProjectSummary;

  const mappedDetails = backendData.details?.map((detail: any) => ({
    id: detail.id,
    summary_id: detail.summary_id,
    module: detail.module,
    case_field: detail.case_field,
    causes: detail.causes,
    action: detail.action,
    assignees: detail.assignees,
    deadline: detail.deadline,
    status: detail.status,
    close_date: detail.close_date,
  })) || [];

  return {
    ...backendData,
    details: mappedDetails,
  };
};

const summaryServiceAPI = {
  // GET: Ambil semua summary untuk project tertentu (dengan paging)
  fetchProjectSummaries: async (
    projectId: number,
    page = 0,
    limit = 10
  ): Promise<ProjectSummaryResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/summary?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Summary API raw data:", result); // Debug: tampilkan data di console
      if (!result?.status || !result?.data) {
        throw new Error("Invalid API response");
      }
      return result.data as ProjectSummaryResponse;
    } catch (error) {
      console.error("Error fetching project summaries:", error);
      throw error;
    }
  },

  // GET: Ambil detail summary berdasarkan ID
  fetchProjectSummary: async (
    projectId: number,
    summaryId: number
  ): Promise<ProjectSummary> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/summary/${summaryId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetch summary by ID raw data:", result);
      if (!result?.status || !result?.data) {
        throw new Error("Invalid API response");
      }
      return mapBackendToProjectSummary(result.data);
    } catch (error) {
      console.error("Error fetching project summary details:", error);
      throw error;
    }
  },

  // POST: Buat summary baru untuk project tertentu
  createProjectSummary: async (
    projectId: number,
    data: { summaryDetails: Omit<SummaryDetail, "id" | "summary_id">[] }
  ): Promise<ProjectSummary> => {
    try {
      const backendPayload = {
        summary_details: data.summaryDetails,
      };
      const response = await fetch(`${API_BASE_URL}/${projectId}/summary`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPayload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Create summary raw data:", result);
      if (!result?.status || !result?.data) {
        throw new Error("Invalid API response");
      }
      return mapBackendToProjectSummary(result.data);
    } catch (error) {
      console.error("Error creating project summary:", error);
      throw error;
    }
  },

  // PUT: Perbarui summary berdasarkan ID
  updateProjectSummary: async (
    projectId: number,
    summaryId: number,
    data: { summaryDetails: Omit<SummaryDetail, "id" | "summary_id">[] }
  ): Promise<ProjectSummary> => {
    try {
      const backendPayload = {
        summary_details: data.summaryDetails,
      };
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/summary/${summaryId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(backendPayload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Update summary raw data:", result);
      if (!result?.status || !result?.data) {
        throw new Error("Invalid API response");
      }
      return mapBackendToProjectSummary(result.data);
    } catch (error) {
      console.error("Error updating project summary:", error);
      throw error;
    }
  },

  // DELETE: Hapus summary berdasarkan ID
  deleteProjectSummary: async (
    projectId: number,
    summaryId: number
  ): Promise<any> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/summary/${summaryId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Delete summary raw data:", result);
      return result;
    } catch (error) {
      console.error("Error deleting project summary:", error);
      throw error;
    }
  },
};

export default summaryServiceAPI;

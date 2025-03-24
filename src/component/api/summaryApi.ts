// summaryApi.ts
import authApi from "./authApi";

// Project Detail interface
export interface ProjectDetail {
  projectName: string;
  pm: string;
  erd_number: string;
  client: string;
}

// Summary Detail interface aligned with backend structure
export interface SummaryDetail {
  id?: number;
  summary_id?: number;
  module: string;
  case_field: string; // Matches the field in backend
  causes: string;
  action: string;
  assignees: string[];
  deadline: string;
  status: string;
  close_date: string | null;
}

// Project Summary interface aligned with backend response
export interface ProjectSummary {
  id: number;
  project_id: number;
  created_at?: string;
  updated_at?: string;
  summary_details?: SummaryDetail[]; // Backend returns summary_details, not details
  details?: SummaryDetail[]; // Some endpoints might return details instead
}

// Response interface for paginated results
export interface ProjectSummaryResponse {
  result: ProjectSummary[];
  page: number;
  limit: number;
  total_rows: number;
  total_page: number;
}

const API_BASE_URL = "http://localhost:8080/api/projects";

// Helper to get authentication headers
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

// Map backend response to frontend model
const mapBackendToProjectSummary = (backendData: any): ProjectSummary => {
  if (!backendData) return {} as ProjectSummary;

  // Check if we have summary_details from getOne or details from getAll
  const detailsArray = backendData.summary_details || backendData.details || [];
  
  const mappedDetails = detailsArray.map((detail: any) => ({
    id: detail.id,
    summary_id: detail.summary_id,
    module: detail.module,
    case_field: detail.case_field || detail.case, // Handle both field names
    causes: detail.causes,
    action: detail.action,
    assignees: Array.isArray(detail.assignees) ? detail.assignees : 
               (typeof detail.assignees === 'string' ? 
                detail.assignees.split(',').map((item: string) => item.trim()) : 
                []),
    deadline: detail.deadline,
    status: detail.status,
    close_date: detail.close_date,
  }));

  return {
    id: backendData.id,
    project_id: backendData.project_id,
    created_at: backendData.created_at,
    updated_at: backendData.updated_at,
    summary_details: mappedDetails,
    details: mappedDetails,
  };
};

const summaryServiceAPI = {
  // GET: Fetch all summaries for a specific project (with pagination)
  fetchProjectSummaries: async (
    projectId: number,
    page = 0,
    limit = 10
  ): Promise<ProjectSummaryResponse> => {
    try {
      console.log(`Fetching summaries for project ${projectId}, page ${page}, limit ${limit}`);
      const url = `${API_BASE_URL}/${projectId}/summary?page=${page}&limit=${limit}`;
      console.log("Request URL:", url);
      
      const headers = getAuthHeaders();
      console.log("Request headers:", headers);
      
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Raw API Response:", JSON.stringify(result, null, 2));
      
      // More flexible validation to handle different response formats
      if (!result) {
        throw new Error("Empty API response");
      }
      
      // Handle different response structures
      let summaryData;
      if (result.data && result.status === "success") {
        // Standard format {status: 'success', data: {...}}
        summaryData = result.data;
      } else if (result.result !== undefined) {
        // Direct result format
        summaryData = result;
      } else if (Array.isArray(result)) {
        // Array response
        summaryData = {
          result: result,
          page: page,
          limit: limit,
          total_rows: result.length,
          total_page: Math.ceil(result.length / limit)
        };
      } else {
        // Assume the result itself is the data
        summaryData = {
          result: [result],
          page: page,
          limit: limit,
          total_rows: 1,
          total_page: 1
        };
      }
      
      // Map each summary in the result array if it exists
      const mappedResult: ProjectSummaryResponse = {
        result: (summaryData.result || []).map((summary: any) => mapBackendToProjectSummary(summary)),
        page: summaryData.page || page,
        limit: summaryData.limit || limit,
        total_rows: summaryData.total_rows || 0,
        total_page: summaryData.total_page || 1
      };
      
      console.log("Mapped response:", mappedResult);
      return mappedResult;
    } catch (error) {
      console.error("Error fetching project summaries:", error);
      // Log additional details about the error
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  },

  // GET: Fetch a specific summary by ID
  fetchProjectSummary: async (
    projectId: number,
    summaryId: number
  ): Promise<ProjectSummary> => {
    try {
      console.log(`Fetching summary ${summaryId} for project ${projectId}`);
      const url = `${API_BASE_URL}/${projectId}/summary/${summaryId}`;
      console.log("Request URL:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Raw API Response:", JSON.stringify(result, null, 2));
      
      if (!result) {
        throw new Error("Empty API response");
      }
      
      // Handle different response structures
      let summaryData;
      if (result.data && result.status === "success") {
        summaryData = result.data;
      } else {
        summaryData = result;
      }
      
      const mappedSummary = mapBackendToProjectSummary(summaryData);
      console.log("Mapped summary:", mappedSummary);
      
      return mappedSummary;
    } catch (error) {
      console.error("Error fetching project summary details:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      throw error;
    }
  },

  // POST: Create a new summary for a project
  createProjectSummary: async (
    projectId: number,
    data: { summaryDetails: Omit<SummaryDetail, "id" | "summary_id">[] }
  ): Promise<ProjectSummary> => {
    try {
      console.log(`Creating summary for project ${projectId}`);
      
      // Transform data to match backend expectations
      const backendPayload = {
        project_id: projectId,
        summaryDetails: data.summaryDetails.map(detail => ({
          module: detail.module,
          case: detail.case_field, // Backend expects 'case', not 'case_field'
          causes: detail.causes,
          action: detail.action,
          assignees: detail.assignees,
          deadline: detail.deadline,
          status: detail.status,
          close_date: detail.close_date,
        }))
      };
      
      console.log("Request payload:", JSON.stringify(backendPayload, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/${projectId}/summary`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPayload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Create API Response:", JSON.stringify(result, null, 2));
      
      if (!result) {
        throw new Error("Empty API response");
      }
      
      // Handle different response structures
      let summaryData;
      if (result.data && result.status === "success") {
        summaryData = result.data;
      } else {
        summaryData = result;
      }
      
      const mappedSummary = mapBackendToProjectSummary(summaryData);
      console.log("Created summary:", mappedSummary);
      
      return mappedSummary;
    } catch (error) {
      console.error("Error creating project summary:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      throw error;
    }
  },

  // PUT: Update a summary
  updateProjectSummary: async (
    projectId: number,
    summaryId: number,
    data: { summaryDetails: Omit<SummaryDetail, "id" | "summary_id">[] }
  ): Promise<ProjectSummary> => {
    try {
      console.log(`Updating summary ${summaryId} for project ${projectId}`);
      
      // Transform data to match backend expectations
      const backendPayload = {
        project_id: projectId,
        summaryDetails: data.summaryDetails.map(detail => ({
          module: detail.module,
          case_field: detail.case_field,
          causes: detail.causes,
          action: detail.action,
          assignees: detail.assignees,
          deadline: detail.deadline,
          status: detail.status,
          close_date: detail.close_date,
        }))
      };
      
      console.log("Update payload:", JSON.stringify(backendPayload, null, 2));
      
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/summary/${summaryId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(backendPayload),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Update API Response:", JSON.stringify(result, null, 2));
      
      if (!result) {
        throw new Error("Empty API response");
      }
      
      // Handle different response structures
      let summaryData;
      if (result.data && result.status === "success") {
        summaryData = result.data;
      } else {
        summaryData = result;
      }
      
      const mappedSummary = mapBackendToProjectSummary(summaryData);
      console.log("Updated summary:", mappedSummary);
      
      return mappedSummary;
    } catch (error) {
      console.error("Error updating project summary:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      throw error;
    }
  },

  // DELETE: Delete a summary by ID
  deleteProjectSummary: async (
    projectId: number,
    summaryId: number
  ): Promise<any> => {
    try {
      console.log(`Deleting summary ${summaryId} for project ${projectId}`);
      
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/summary/${summaryId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Delete API Response:", JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error("Error deleting project summary:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      throw error;
    }
  },
};

export default summaryServiceAPI;
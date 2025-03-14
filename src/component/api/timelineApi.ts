import authApi from "./authApi";

// Tipe detail timeline (menyesuaikan dengan format backend)
export interface TimelineDetail {
  id?: number;         // Pastikan setiap detail memiliki ID untuk keperluan update
  module: string;
  startDate: string;   // Frontend menggunakan camelCase
  endDate: string;     // Frontend menggunakan camelCase
  status: string;
}

// Tipe projectTimeline
export interface ProjectTimeline {
  id?: number;
  project_id?: number;
  created_at?: string;
  updated_at?: string;
  details?: TimelineDetail[];
  projectName?: string;
  pm?: string;
  date?: string;
  client?: string;
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

// Helper untuk mengubah format data dari backend ke frontend
const mapBackendToFrontend = (backendData: any): ProjectTimeline => {
  if (!backendData) return {} as ProjectTimeline;
  
  // Pemetaan details (ubah snake_case ke camelCase dan mapping ID)
  const mappedDetails = backendData.details?.map((detail: any) => ({
    id: detail.id,
    module: detail.module,
    startDate: detail.start_date,
    endDate: detail.end_date,
    status: detail.status,
  })) || [];
  
  return {
    ...backendData,
    details: mappedDetails,
  };
};

const projectTimelineAPI = {
  // GET: Ambil semua timeline dari project tertentu
  getAllTimelines: async (projectId: number): Promise<ProjectTimeline[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${projectId}/timeline`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("getAllTimelines => raw result:", result);
      if (!result?.status || !result?.data?.result) {
        console.error("Invalid API response:", result);
        return [];
      }
      return Array.isArray(result.data.result)
        ? result.data.result.map(mapBackendToFrontend)
        : [];
    } catch (error) {
      console.error("Error fetching timelines:", error);
      return [];
    }
  },

  // GET: Ambil satu timeline berdasarkan ID
  getTimelineById: async (timelineId: number): Promise<ProjectTimeline> => {
    try {
      const response = await fetch(`${API_BASE_URL}/timeline/${timelineId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("getTimelineById => raw result:", result);
      return mapBackendToFrontend(result?.data || {});
    } catch (error) {
      console.error("Error fetching timeline by id:", error);
      return {} as ProjectTimeline;
    }
  },

  // POST: Buat timeline baru untuk project tertentu
  createTimeline: async (payload: { details: TimelineDetail[] }, projectId: number): Promise<ProjectTimeline> => {
    try {
      const backendPayload = {
        project_id: projectId,
        details: payload.details.map(detail => ({
          module: detail.module,
          start_date: detail.startDate,
          end_date: detail.endDate,
          status: detail.status,
        })),
      };
      const response = await fetch(`${API_BASE_URL}/${projectId}/timeline`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPayload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("createTimeline => raw result:", result);
      return mapBackendToFrontend(result?.data || {});
    } catch (error) {
      console.error("Error creating timeline:", error);
      throw error;
    }
  },

  // PUT: Update timeline berdasarkan ID
  updateTimeline: async (timelineId: number, payload: any): Promise<ProjectTimeline> => {
    try {
      const backendPayload = { ...payload };
      if (payload.details) {
        backendPayload.details = payload.details.map((detail: TimelineDetail) => ({
          module: detail.module,
          start_date: detail.startDate,
          end_date: detail.endDate,
          status: detail.status,
        }));
      }
      const response = await fetch(`${API_BASE_URL}/timeline/${timelineId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPayload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("updateTimeline => raw result:", result);
      return mapBackendToFrontend(result?.data || {});
    } catch (error) {
      console.error("Error updating timeline:", error);
      throw error;
    }
  },

  // DELETE: Hapus timeline berdasarkan ID
  deleteTimeline: async (timelineId: number): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/timeline/${timelineId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("deleteTimeline => raw result:", result);
      return result;
    } catch (error) {
      console.error("Error deleting timeline:", error);
      throw error;
    }
  },

  // PATCH: Perbarui status timeline detail menggunakan route:
  // "/:projectId/timeline-detail/:detailId"
  updateTimelineDetailStatus: async (
    projectId: number,
    detailId: number,
    newStatus: string
  ): Promise<ProjectTimeline> => {
    try {
      // Jika backend mengharapkan payload terbungkus dalam "timeline_detail"
      const payload = { timeline_detail: { status: newStatus } };
      console.log("Sending payload:", payload);
      const response = await fetch(
        `${API_BASE_URL}/${projectId}/timeline-detail/${detailId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("updateTimelineDetailStatus => raw result:", result);
      return mapBackendToFrontend(result?.data || {});
    } catch (error) {
      console.error("Error updating timeline detail status:", error);
      throw error;
    }
  },
};

export default projectTimelineAPI;

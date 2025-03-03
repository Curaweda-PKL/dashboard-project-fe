import authApi from "./authApi";

export interface TeamMember {
  id: number;
  name: string;
  role?: string;
  assigned?: string;
  teamRoleId?: number;
  teamAssignId?: number;
}

export interface TeamRole {
  id: number;
  name: string;
}

export interface TeamAssignment {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    result: T[];
    page: number;
    limit: number;
    total_rows: number;
    total_page: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const teamApi = (() => {
    const BASE_URL = "http://localhost:8080/api";

  // Helper untuk meng‑unwrap response bila data dibungkus dalam properti "data"
  const processResponse = (jsonData: any) => {
    return jsonData.data ? jsonData.data : jsonData;
  };

  // Fungsi untuk memapping data team member dari backend ke interface TeamMember
  const mapTeamMember = (member: any): TeamMember => ({
    id: member.id,
    name: member.name,
    role: member.role,
    assigned: member.assigned,
    teamRoleId: member.teamRoleId,
    teamAssignId: member.teamAssignId,
  });

  async function getAllTeamMembers(page = 1, limit = 10, search = ''): Promise<TeamMember[]> {
    try {
      const result = await authApi._fetchWithAuth(
        `${BASE_URL}/team?page=${page}&limit=${limit}&search=${search}`
      );
      const data = processResponse(result);
      // Jika respons tidak langsung berupa array, periksa properti "result"
      const membersArray = Array.isArray(data)
        ? data
        : data.result && Array.isArray(data.result)
        ? data.result
        : [];
      return membersArray.map((member: any) => mapTeamMember(member));
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch team members"
      );
    }
  }

  async function getTeamMember(id: number): Promise<TeamMember> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/team/${id}`);
      const data = processResponse(result);
      return mapTeamMember(data);
    } catch (error) {
      console.error(`Error fetching team member ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch team member"
      );
    }
  }

  async function updateTeamData(
    id: number,
    data: { teamRoleId?: number; teamAssignId?: number }
  ): Promise<TeamMember> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/team/${id}/teamdata`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = processResponse(result);
      return mapTeamMember(responseData);
    } catch (error) {
      console.error(`Error updating team member ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update team member"
      );
    }
  }

  async function getTeamRoles(): Promise<TeamRole[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/teamroles`);
      const data = processResponse(result);
      return data;
    } catch (error) {
      console.error("Error fetching team roles:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch team roles"
      );
    }
  }

  async function getTeamAssignments(): Promise<TeamAssignment[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/teamassign`);
      const data = processResponse(result);
      return data;
    } catch (error) {
      console.error("Error fetching team assignments:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch team assignments"
      );
    }
  }

  return {
    getAllTeamMembers,
    getTeamMember,
    updateTeamData,
    getTeamRoles,
    getTeamAssignments,
  };
})();

export default teamApi;

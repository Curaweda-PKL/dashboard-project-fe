import authApi from "./authApi"; // Pastikan import authApi sesuai dengan lokasi dan implementasinya

export interface TeamMember {
  id: number;
  name: string;
  division: string;
  assigned: string;
  status: string; // Added status field
}

// Interface for team creation payload
export interface TeamCreatePayload {
  user_id: number;
  division: string;
  status?: string; // Optional, karena bisa memiliki nilai default di backend
}

const teamApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: Ekstrak data jika respons dibungkus dalam properti "data"
  const processResponse = (data: any) => {
    if (!data) return null;
    return data.data ? data.data : data;
  };

  // Mapping respons untuk memastikan properti name, role, assigned, dan status muncul dengan benar.
  // Jika properti name tidak ada, coba ambil dari objek user.
  const mapTeamMember = (item: any): TeamMember => ({
    id: item.id,
    name: item.name || (item.user ? item.user.name : ""),
    division: item.division,
    assigned: item.assigned,
    status: item.status || "active", // Default status jika tidak ada
  });

  // Ambil semua team member
  async function getAllTeams(): Promise<TeamMember[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/teams`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = processResponse(result);
      if (!data) return [];
      const resultArray = Array.isArray(data) ? data : data.result || [];
      return resultArray.map(mapTeamMember);
    } catch (error: any) {
      console.error("Error in getAllTeams:", error);
      throw error;
    }
  }

  // Create a new team member
  async function createTeamMember(teamData: TeamCreatePayload): Promise<TeamMember> {
    try {
      console.log("Creating team member with data:", teamData);
      const result = await authApi._fetchWithAuth(`${BASE_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });
      console.log("Response create:", result);
      const data = processResponse(result);
      if (!data) throw new Error("Response data is null");
      return mapTeamMember(data);
    } catch (error: any) {
      console.error("Error creating team member:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create team member"
      );
    }
  }

  // Update team member berdasarkan ID menggunakan endpoint /teams/update/:id
  async function updateTeamMember(
    id: number,
    updateData: Partial<TeamMember>
  ): Promise<TeamMember> {
    try {
      const formattedData: any = {};
      if (updateData.division !== undefined) {
        formattedData.division = updateData.division;
      }
      if (updateData.assigned !== undefined) {
        formattedData.assigned = updateData.assigned;
      }
      if (updateData.status !== undefined) {
        formattedData.status = updateData.status;
      }
      console.log("Payload update:", formattedData);
      const updateUrl = `${BASE_URL}/teams/update/${id}`;
      const result = await authApi._fetchWithAuth(updateUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      console.log("Response update:", result);
      const data = processResponse(result);
      if (!data) throw new Error("Response data is null");
      return mapTeamMember(data);
    } catch (error: any) {
      console.error(`Error updating team member ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update team member"
      );
    }
  }

  // Delete team member by ID (sambung ke backend)
  async function deleteTeamMember(id: number): Promise<TeamMember> {
    try {
      const deleteUrl = `${BASE_URL}/teams/delete/${id}`;
      const result = await authApi._fetchWithAuth(deleteUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = processResponse(result);
      return mapTeamMember(data);
    } catch (error: any) {
      console.error(`Error deleting team member ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete team member"
      );
    }
  }

  // Update status team member
  async function updateTeamStatus(
    id: number,
    status: string
  ): Promise<TeamMember> {
    return updateTeamMember(id, { status });
  }

  // Get team members filtered by status
  async function getTeamsByStatus(status: string): Promise<TeamMember[]> {
    try {
      const allTeams = await getAllTeams();
      return allTeams.filter(team => team.status === status);
    } catch (error: any) {
      console.error("Error in getTeamsByStatus:", error);
      throw error;
    }
  }

  return {
    getAllTeams,
    createTeamMember,
    updateTeamMember,
    updateTeamStatus,
    getTeamsByStatus,
    deleteTeamMember,
  };
})();

export default teamApi;

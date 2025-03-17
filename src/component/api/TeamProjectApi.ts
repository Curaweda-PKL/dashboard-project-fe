import authApi from "./authApi"; // Pastikan import authApi sesuai dengan lokasi dan implementasinya

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  assigned: string;
  status: string; // Added status field
}

export interface ProjectTeamAssignment {
  id: number;
  projectId: number;
  teamId: number;
  team?: TeamMember;
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
    role: item.role,
    assigned: item.assigned,
    status: item.status || "active", // Default status jika tidak ada
  });

  // Map project team assignment response
  const mapProjectTeamAssignment = (item: any): ProjectTeamAssignment => ({
    id: item.id,
    projectId: item.projectId,
    teamId: item.teamId,
    team: item.team ? mapTeamMember(item.team) : undefined
  });

  // Ambil semua team member
  async function getAllTeams(): Promise<TeamMember[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/teams`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = processResponse(result);
      // Jika data null, kembalikan array kosong agar tabel di UI dikosongkan
      if (!data) return [];
      const resultArray = Array.isArray(data) ? data : data.result || [];
      return resultArray.map(mapTeamMember);
    } catch (error: any) {
      console.error("Error in getAllTeams:", error);
      throw error;
    }
  }

  // Update team member berdasarkan ID menggunakan endpoint /teams/update/:id
  async function updateTeamMember(
    id: number,
    updateData: Partial<TeamMember>
  ): Promise<TeamMember> {
    try {
      // Bangun payload dengan mapping yang sesuai (mengirim role, assigned, dan status)
      const formattedData: any = {};
      if (updateData.role !== undefined) {
        formattedData.role = updateData.role;
      }
      if (updateData.assigned !== undefined) {
        formattedData.assigned = updateData.assigned;
      }
      if (updateData.status !== undefined) {
        formattedData.status = updateData.status;
      }

      console.log("Payload update:", formattedData);

      // Gunakan endpoint sesuai dengan route back end: /teams/update/:id
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

  // Add a team to a project
  async function addTeamToProject(
    projectId: number,
    teamId: number
  ): Promise<ProjectTeamAssignment> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${projectId}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      
      console.log("Response addTeamToProject:", result);
      
      const data = processResponse(result);
      if (!data) throw new Error("Response data is null");
      return mapProjectTeamAssignment(data);
    } catch (error: any) {
      console.error(`Error adding team ${teamId} to project ${projectId}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to add team to project"
      );
    }
  }

  // Get all teams assigned to a project
  async function getProjectTeams(projectId: number): Promise<ProjectTeamAssignment[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${projectId}/team`, {
        headers: { "Content-Type": "application/json" },
      });
      
      const data = processResponse(result);
      if (!data) return [];
      
      const resultArray = Array.isArray(data) ? data : data.result || [];
      return resultArray.map(mapProjectTeamAssignment);
    } catch (error: any) {
      console.error(`Error getting teams for project ${projectId}:`, error);
      throw error;
    }
  }

  // Remove a team from a project
  async function removeTeamFromProject(
    projectId: number,
    assignmentId: number
  ): Promise<boolean> {
    try {
      const result = await authApi._fetchWithAuth(
        `${BASE_URL}/projects/${projectId}/team/${assignmentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      
      console.log("Response removeTeamFromProject:", result);
      return true;
    } catch (error: any) {
      console.error(`Error removing team assignment ${assignmentId} from project ${projectId}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to remove team from project"
      );
    }   
  }

  return {
    getAllTeams,
    updateTeamMember,
    updateTeamStatus,
    getTeamsByStatus,
    addTeamToProject,
    getProjectTeams,
    removeTeamFromProject
  };
})();

export default teamApi;
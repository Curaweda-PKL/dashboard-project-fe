import authApi from "./authApi";

export interface TeamMember {
  id: number;
  name: string;
  division: string;
  assigned: string;
  status: string;
}

export interface ProjectTeamAssignment {
  id: number;
  projectId: number;
  teamId: number;
  team?: TeamMember;
}

// Interface for creating a new team assignment
export interface CreateTeamAssignmentRequest {
  projectId: number;
  teamId: number;
}

const teamApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: Extract data if response is wrapped in "data" property
  const processResponse = (data: any) => {
    if (!data) return null;
    return data.data ? data.data : data;
  };

  // Map team member response
  const mapTeamMember = (item: any): TeamMember => ({
    id: item.id,
    name: item.name || (item.user ? item.user.name : ""),
    division: item.division,
    assigned: item.assigned,
    status: item.status || "",
  });

  // Map project team assignment response
  const mapProjectTeamAssignment = (item: any): ProjectTeamAssignment => ({
    id: item.id,
    projectId: item.projectId,
    teamId: item.teamId,
    team: item.team ? mapTeamMember(item.team) : undefined
  });

  // Get all team members
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

  // Update team member by ID
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

  // Update team member status
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

  // Create a new team assignment for a project (explicit create method)
  async function createTeamAssignment(
    data: CreateTeamAssignmentRequest
  ): Promise<ProjectTeamAssignment> {
    try {
      const { projectId, teamId } = data;
      
      const result = await authApi._fetchWithAuth(`${BASE_URL}/projects/${projectId}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      
      console.log("Response createTeamAssignment:", result);
      
      const responseData = processResponse(result);
      if (!responseData) throw new Error("Response data is null");
      return mapProjectTeamAssignment(responseData);
    } catch (error: any) {
      console.error(`Error creating team assignment:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create team assignment"
      );
    }
  }

  // Add a team to a project - Updated to match backend route
  async function addTeamToProject(
    projectId: number,
    teamId: number
  ): Promise<ProjectTeamAssignment> {
    try {
      // This matches the backend route: POST /projects/:projectId/team
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

  // Get all teams assigned to a project - Already matches backend route
  async function getProjectTeams(projectId: number): Promise<ProjectTeamAssignment[]> {
    try {
      // This matches the backend route: GET /projects/:projectId/team
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

  // Remove a team from a project - Updated to match backend route
  async function removeTeamFromProject(
    projectId: number,
    assignmentId: number
  ): Promise<boolean> {
    try {
      // This matches the backend route: DELETE /projects/:projectId/team/:id
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

  // NEW: Update a team assignment in a project
  async function updateProjectTeamAssignment(
    projectId: number,
    assignmentId: number,
    teamId: number
  ): Promise<ProjectTeamAssignment> {
    try {
      // This matches the backend route: PUT /projects/:projectId/team/:id
      const result = await authApi._fetchWithAuth(
        `${BASE_URL}/projects/${projectId}/team/${assignmentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId, projectId }),
        }
      );
      
      console.log("Response updateProjectTeamAssignment:", result);
      
      const data = processResponse(result);
      if (!data) throw new Error("Response data is null");
      return mapProjectTeamAssignment(data);
    } catch (error: any) {
      console.error(`Error updating team assignment ${assignmentId} in project ${projectId}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update team assignment"
      );
    }
  }

  // NEW: Get a specific team assignment by ID
  async function getProjectTeamAssignment(
    projectId: number,
    assignmentId: number
  ): Promise<ProjectTeamAssignment> {
    try {
      // This matches the backend route: GET /projects/:projectId/team/:id
      const result = await authApi._fetchWithAuth(
        `${BASE_URL}/projects/${projectId}/team/${assignmentId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      const data = processResponse(result);
      if (!data) throw new Error("Team assignment not found");
      
      return mapProjectTeamAssignment(data);
    } catch (error: any) {
      console.error(`Error getting team assignment ${assignmentId} for project ${projectId}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get team assignment"
      );
    }
  }

  return {
    getAllTeams,
    updateTeamMember,
    updateTeamStatus,
    getTeamsByStatus,
    createTeamAssignment,  // New explicit create method
    addTeamToProject,
    getProjectTeams,
    removeTeamFromProject,
    updateProjectTeamAssignment,
    getProjectTeamAssignment
  };
})();

export default teamApi;
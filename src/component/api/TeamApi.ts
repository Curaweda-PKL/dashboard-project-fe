import authApi from "./authApi"; // Pastikan import authApi sesuai dengan lokasi dan implementasinya

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  assigned: string;
}

const teamApi = (() => {
  const BASE_URL = "http://localhost:8080/api";

  // Helper: Ekstrak data jika respons dibungkus dalam properti "data"
  const processResponse = (data: any) => (data.data ? data.data : data);

  // Mapping respons untuk memastikan properti name, role, dan assigned muncul dengan benar.
  // Jika properti name tidak ada, coba ambil dari objek user.
  const mapTeamMember = (item: any): TeamMember => ({
    id: item.id,
    name: item.name || (item.user ? item.user.name : ""),
    role: item.role,
    assigned: item.assigned,
  });

  // Ambil semua team member
  async function getAllTeams(): Promise<TeamMember[]> {
    try {
      const result = await authApi._fetchWithAuth(`${BASE_URL}/teams`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = processResponse(result);
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
      // Bangun payload dengan mapping yang sesuai (hanya mengirim role dan assigned)
      const formattedData: any = {};
      if (updateData.role !== undefined) {
        formattedData.role = updateData.role;
      }
      if (updateData.assigned !== undefined) {
        formattedData.assigned = updateData.assigned;
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
      return mapTeamMember(data);
    } catch (error: any) {
      console.error(`Error updating team member ${id}:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update team member"
      );
    }
  }

  return {
    getAllTeams,
    updateTeamMember,
  };
})();

export default teamApi;

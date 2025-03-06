// Definisikan tipe untuk detail timeline
interface TimelineDetail {
    module: string;
    start_date: string; // Bisa juga berupa Date jika diperlukan, tapi pastikan konversi yang tepat
    end_date: string;
    status: string;
  }
  
  // Tipe untuk data timeline secara keseluruhan
  interface TimelineData {
    project_id: number;
    details: TimelineDetail[];
  }
  
  // URL dasar API (ubah sesuai konfigurasi server)
  const BASE_URL = "http://localhost:3000/api/project-timelines";
  
  /**
   * Mengambil data project timeline dengan parameter pencarian, offset, dan limit.
   * @param search Nilai pencarian untuk project_id (bisa string atau number).
   * @param offset Posisi offset untuk paginasi.
   * @param limit Batas data yang ingin diambil.
   */
  export async function getProjectTimelines(
    search: string | number = "",
    offset: number = 0,
    limit: number = 10
  ): Promise<any> {
    try {
      const response = await fetch(
        `${BASE_URL}?search=${search}&offset=${offset}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat mengambil data timeline");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
  /**
   * Mengambil data satu project timeline berdasarkan id.
   * @param id ID timeline.
   */
  export async function getProjectTimelineById(id: number): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat mengambil data timeline");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
  /**
   * Membuat project timeline baru.
   * @param timelineData Data timeline baru dengan tipe TimelineData.
   */
  export async function createProjectTimeline(
    timelineData: TimelineData
  ): Promise<any> {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timelineData),
      });
      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat membuat timeline");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
  /**
   * Memperbarui data project timeline berdasarkan id.
   * @param id ID timeline yang akan diperbarui.
   * @param timelineData Data baru untuk timeline dengan tipe TimelineData.
   */
  export async function updateProjectTimeline(
    id: number,
    timelineData: TimelineData
  ): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timelineData),
      });
      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat memperbarui timeline");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
  /**
   * Menghapus project timeline berdasarkan id.
   * @param id ID timeline yang akan dihapus.
   */
  export async function deleteProjectTimeline(id: number): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Terjadi kesalahan saat menghapus timeline");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  
  // Contoh penggunaan fungsi fetch
  (async () => {
    // Contoh: Mengambil semua timeline dengan pencarian "1", offset 0 dan limit 10
    const timelines = await getProjectTimelines("1", 0, 10);
    console.log("Data timelines:", timelines);
  
    // Contoh: Mengambil satu timeline berdasarkan id
    const timeline = await getProjectTimelineById(1);
    console.log("Data timeline:", timeline);
  
    // Contoh: Membuat timeline baru
    const newTimeline: TimelineData = {
      project_id: 1,
      details: [
        {
          module: "Module A",
          start_date: "2025-01-01",
          end_date: "2025-02-01",
          status: "pending",
        },
      ],
    };
    const createdTimeline = await createProjectTimeline(newTimeline);
    console.log("Timeline baru:", createdTimeline);
  
    // Contoh: Memperbarui timeline dengan id tertentu
    const updateData: TimelineData = {
      project_id: 1,
      details: [
        {
          module: "Module B",
          start_date: "2025-03-01",
          end_date: "2025-04-01",
          status: "in-progress",
        },
      ],
    };
    const updatedTimeline = await updateProjectTimeline(1, updateData);
    console.log("Timeline yang diperbarui:", updatedTimeline);
  
    // Contoh: Menghapus timeline dengan id tertentu
    const deletedTimeline = await deleteProjectTimeline(1);
    console.log("Timeline yang dihapus:", deletedTimeline);
  })();
  
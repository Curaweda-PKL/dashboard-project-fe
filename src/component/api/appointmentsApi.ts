// projectSummaryApi.ts

// Definisikan tipe data untuk hasil yang diharapkan
export interface ProjectSummary {
  title: string;
  start_date: string; // misalnya dalam format ISO string
  end_date: string;
}

/**
 * Fungsi untuk mengambil data proyek dari API dan mengembalikan
 * hanya field title, start_date, dan end_date.
 */
export async function fetchProjectSummary(): Promise<ProjectSummary[]> {
  try {
    const response = await fetch("http://localhost:8080/api/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorRes = await response.json().catch(() => ({}));
      throw new Error(errorRes.message || "Failed to fetch projects");
    }

    // Ambil data JSON dari respons
    const jsonData = await response.json();

    // Jika API mengembalikan objek dengan properti "data", gunakan properti tersebut,
    // jika tidak, gunakan jsonData langsung.
    const projects = jsonData.data ? jsonData.data : jsonData;

    if (!Array.isArray(projects)) {
      throw new Error("Projects data is not an array");
    }

    // Map data proyek untuk mengembalikan hanya field title, start_date, dan end_date
    const projectSummaries: ProjectSummary[] = projects.map((project: any) => ({
      title: project.title,
      start_date: project.start_date,
      end_date: project.end_date,
    }));

    return projectSummaries;
  } catch (error) {
    console.error("Error fetching project summary:", error);
    return [];
  }
}

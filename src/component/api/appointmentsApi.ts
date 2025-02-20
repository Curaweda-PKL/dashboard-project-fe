const BASE_URL = "http://localhost:8080/api";

export interface ProjectSummary {
  title: string;
  start_date: Date;
  end_date: Date;
}

export async function fetchProjectSummary(): Promise<ProjectSummary[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found!");
      throw new Error("No auth token found!");
    }

    console.log("Fetching data from:", `${BASE_URL}/projects`);

    const response = await fetch(`${BASE_URL}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Gunakan token dari localStorage
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Project Data:", data);

    return data.map((project: any) => ({
      title: project.title,
      start_date: new Date(project.start_date),
      end_date: new Date(project.end_date),
    }));
  } catch (error) {
    console.error("Error fetching project summary:", error);
    return [];
  }
}


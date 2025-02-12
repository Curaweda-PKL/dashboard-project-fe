import * as React from "react";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { fetchProjectSummary, ProjectSummary } from "../../component/api/appointmentsApi"; // sesuaikan path-nya

// Definisikan tipe data untuk Appointment yang diharapkan oleh Scheduler
interface Appointment {
  title: string;
  startDate: Date;
  endDate: Date;
}

const Demo: React.FC = () => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadAppointments() {
      try {
        // Ambil data proyek dari API
        const projectData: ProjectSummary[] = await fetchProjectSummary();
        // Map data proyek ke format Appointment yang dibutuhkan Scheduler
        const mappedAppointments: Appointment[] = projectData.map((project) => ({
          title: project.title,
          startDate: new Date(project.start_date),
          endDate: new Date(project.end_date),
        }));
        setAppointments(mappedAppointments);
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper>
      <Scheduler data={appointments}>
        <ViewState defaultCurrentDate="2025-01-10" />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />
      </Scheduler>
    </Paper>
  );
};

export default Demo;

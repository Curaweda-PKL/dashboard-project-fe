import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { fetchProjectSummary, ProjectSummary } from "../../component/api/appointmentsApi";

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
        const projectData: ProjectSummary[] = await fetchProjectSummary();
        console.log("Mapped appointments:", projectData);

        setAppointments(
          projectData.map((project) => ({
            title: project.title,
            startDate: new Date(project.start_date),
            endDate: new Date(project.end_date),
          }))
        );
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
        {/* Gunakan tanggal saat ini atau sesuaikan dengan data */}
        <ViewState defaultCurrentDate={new Date()} />
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

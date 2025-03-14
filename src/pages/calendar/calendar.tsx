import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { fetchProjectSummary, ProjectSummary } from "../../component/api/appointmentsApi";

// Tipe data appointment yang kita gunakan di frontend
interface Appointment {
  title: string;
  startDate: Date;
  endDate: Date;
}

// Ambil tipe props dari komponen bawaan Appointment
type DxAppointmentProps = React.ComponentProps<typeof Appointments.Appointment>;

// Komponen kustom yang menerima properti sesuai tipe bawaan
const CustomAppointment: React.FC<DxAppointmentProps> = (props) => {
  const { data, style, ...restProps } = props;
  // Lakukan cast data ke tipe Appointment (pastikan data Anda sesuai)
  const appointmentData = data as Appointment;
  const now = new Date();
  let backgroundColor = "";

  if (now > appointmentData.endDate) {
    backgroundColor = "#B20000";
  } else {
    const diffDays =
      (appointmentData.endDate.getTime() - appointmentData.startDate.getTime()) /
      (1000 * 3600 * 24);
    if (diffDays < 7) {
      backgroundColor = "#D6B41E";
    } else if (diffDays < 30) {
      backgroundColor = "curawedaColor";
    } else {
      backgroundColor = "#0AB239";
    }
  }

  return (
    <Appointments.Appointment
      {...restProps}
      data={data}
      style={{ ...style, backgroundColor }}
    />
  );
};

const Demo: React.FC = () => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadAppointments() {
      try {
        const projectData: ProjectSummary[] = await fetchProjectSummary();
        setAppointments(
          projectData.map((project) => ({
            title: project.title || "", // pastikan title selalu string
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
        <ViewState defaultCurrentDate={new Date()} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments appointmentComponent={CustomAppointment} />
      </Scheduler>
    </Paper>
  );
};

export default Demo;

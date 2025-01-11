import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';

const appointments = [
  {
    title: 'Website Re-Design Plan',
    startDate: new Date(2025, 0, 10, 9, 30),
    endDate: new Date(2025, 0, 10, 11, 30),
  },
  {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2025, 0, 10, 12, 0),
    endDate: new Date(2025, 0, 10, 13, 0),
  },
  {
    title: 'Install New Router in Dev Room',
    startDate: new Date(2025, 0, 10, 14, 30),
    endDate: new Date(2025, 0, 10, 15, 30),
  },
  {
    title: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2025, 0, 11, 10, 0),
    endDate: new Date(2025, 0, 11, 11, 0),
  },
  {
    title: 'Final Budget Review',
    startDate: new Date(2025, 0, 11, 12, 0),
    endDate: new Date(2025, 0, 11, 13, 35),
  },
  {
    title: 'New Brochures',
    startDate: new Date(2025, 0, 11, 14, 30),
    endDate: new Date(2025, 0, 11, 15, 45),
  },
  {
    title: 'Install New Database',
    startDate: new Date(2025, 0, 12, 9, 45),
    endDate: new Date(2025, 0, 12, 11, 15),
  },
  {
    title: 'Approve New Online Marketing Strategy',
    startDate: new Date(2025, 0, 12, 12, 0),
    endDate: new Date(2025, 0, 12, 14, 0),
  },
  {
    title: 'Upgrade Personal Computers',
    startDate: new Date(2025, 0, 12, 15, 15),
    endDate: new Date(2025, 0, 12, 16, 30),
  },
  {
    title: 'Customer Workshop',
    startDate: new Date(2025, 0, 13, 11, 0),
    endDate: new Date(2025, 0, 13, 12, 0),
  },
  {
    title: 'Prepare 2015 Marketing Plan',
    startDate: new Date(2025, 0, 13, 11, 0),
    endDate: new Date(2025, 0, 13, 13, 30),
  },
  {
    title: 'Brochure Design Review',
    startDate: new Date(2025, 0, 13, 14, 0),
    endDate: new Date(2025, 0, 13, 15, 30),
  },
  {
    title: 'Create Icons for Website',
    startDate: new Date(2025, 0, 14, 10, 0),
    endDate: new Date(2025, 0, 14, 11, 30),
  },
  {
    title: 'Upgrade Server Hardware',
    startDate: new Date(2025, 0, 14, 14, 30),
    endDate: new Date(2025, 0, 14, 16, 0),
  },
  {
    title: 'Submit New Website Design',
    startDate: new Date(2025, 0, 14, 16, 30),
    endDate: new Date(2025, 0, 14, 18, 0),
  },
  {
    title: 'Launch New Website',
    startDate: new Date(2025, 0, 13, 12, 20),
    endDate: new Date(2025, 0, 13, 14, 0),
  },
  {
    title: 'Website Re-Design Plan',
    startDate: new Date(2025, 0, 16, 9, 30),
    endDate: new Date(2025, 0, 16, 15, 30),
  },
  {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2025, 0, 16, 12, 0),
    endDate: new Date(2025, 0, 16, 13, 0),
  },
  {
    title: 'Install New Database',
    startDate: new Date(2025, 0, 17, 15, 45),
    endDate: new Date(2025, 0, 18, 12, 15),
  },
  {
    title: 'Approve New Online Marketing Strategy',
    startDate: new Date(2025, 0, 18, 12, 35),
    endDate: new Date(2025, 0, 18, 14, 15),
  },
  {
    title: 'Upgrade Personal Computers',
    startDate: new Date(2025, 0, 19, 15, 15),
    endDate: new Date(2025, 0, 20, 20, 30),
  },
  {
    title: 'Prepare 2015 Marketing Plan',
    startDate: new Date(2025, 0, 20, 20, 0),
    endDate: new Date(2025, 0, 20, 13, 30),
  },
  {
    title: 'Brochure Design Review',
    startDate: new Date(2025, 0, 20, 14, 10),
    endDate: new Date(2025, 0, 20, 15, 30),
  },
  {
    title: 'Vacation',
    startDate: new Date(2025, 0, 22),
    endDate: new Date(2025, 0, 1),
  },
  {
    title: 'Vacation',
    startDate: new Date(2025, 0, 28),
    endDate: new Date(2025, 0, 7),
  },
];

const Demo: React.FC = () => {
  const [data] = React.useState(appointments);

  return (
    <Paper>
      <Scheduler data={data}>
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


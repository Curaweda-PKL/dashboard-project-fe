import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import DashboardProject from './component/dashboard';

const Dashboard = () => <div>Dashboard Page</div>;
const Team = () => <div>Team Page</div>;
const Messages = () => <div>Messages Page</div>;
const Calendar = () => <div>Calendar Page</div>;
const Settings = () => <div>Settings Page</div>;

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardProject />} >
          <Route index element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="messages" element={<Messages />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;


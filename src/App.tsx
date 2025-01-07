import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/header";
import Dashboard from "./pages/dashboard";
import TeamTable from "./pages/Team";
import Messages from "./pages/Messages";
import MessagesDetail from "./component/messagesDetail";
import LoginPage from "./pages/auth/loginPage";
import LoginLayout from "./layout/layoutLogin";
import NotFound from "./pages/notFound";
import Setting from "./pages/Setting";
import MyAccount from "./component/myAccount";
import Profiles from "./component/profiles";
import LogOut from "./component/logOut";
import TaskList from "./component/detailproject/tasklist";  // Import TaskList component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route untuk Halaman Login */}
        <Route element={<LoginLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>

        {/* Route dengan Layout Utama */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<TeamTable />} />

          {/* Route Messages */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/detail" element={<MessagesDetail />} /> {/* Updated path for detail */}

          {/* Route Settings dengan Nested Routes */}
          <Route path="/settings" element={<Setting />}>
            <Route path="" element={<MyAccount />} /> {/* Default ke MyAccount */}
            <Route path="profiles" element={<Profiles />} /> {/* Profiles di bawah Settings */}
            <Route path="logOut" element={<LogOut onClose={() => window.history.back()} />} /> {/* Menutup Pop Up dan Kembali */}
          </Route>

          {/* Route for Task List */}
          <Route path="/task" element={<TaskList />} />  {/* New route for TaskList */}
        </Route>

        {/* Route Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

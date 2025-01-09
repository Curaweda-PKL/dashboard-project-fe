import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/header"; // Header layout utama
import Dashboard from "./pages/dashboard"; // Halaman Dashboard
import TeamTable from "./pages/Team"; // Halaman Tim
import Messages from "./pages/Messages"; // Halaman Messages
import MessagesDetail from "./component/messagesDetail"; // Detail pesan
import LoginPage from "./pages/auth/loginPage"; // Halaman Login
import LoginLayout from "./layout/layoutLogin"; // Layout khusus untuk Login
import NotFound from "./pages/notFound"; // Halaman Not Found
import Setting from "./pages/Setting"; // Halaman Setting
import MyAccount from "./component/myAccount"; // Komponen Akun Saya
import Profiles from "./component/profiles"; // Komponen Profil
import LogOut from "./component/logOut"; // Komponen LogOut
import TaskList from "./component/detailproject/tasklist"; // Daftar Tugas
import Summary from "./component/detailproject/summary"; // Komponen Summary

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
          <Route path="/messages/detail" element={<MessagesDetail />} />

          {/* Route Settings dengan Nested Routes */}
          <Route path="/settings" element={<Setting />}>
            <Route path="" element={<MyAccount />} /> {/* Default ke MyAccount */}
            <Route path="profiles" element={<Profiles />} /> {/* Profiles */}
            <Route path="logOut" element={<LogOut onClose={() => window.history.back()} />} />
          </Route>

          {/* Route Task List */}
          <Route path="/task" element={<TaskList />} />

          {/* Route Summary */}
          <Route path="/summary" element={<Summary />} />
        </Route>

        {/* Route Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/header";
import Dashboard from "./pages/dashboard";
import TeamTable from "./pages/Team";
import LoginPage from "./pages/auth/loginPage";
import LoginLayout from "./layout/layoutLogin";
import NotFound from "./pages/notFound";
import Setting from "./pages/Setting";
import MyAccount from "./component/myAccount";
import Profiles from "./component/profiles";
import LogOut from "./component/logOut";

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

          {/* Route Settings dengan Nested Routes */}
          <Route path="/settings" element={<Setting />}>
            <Route path="" element={<MyAccount />} /> {/* Default ke MyAccount */}
            <Route path="profiles" element={<Profiles />} /> {/* Profiles di bawah Settings */}
            <Route path="logOut" element={<LogOut />} /> {/* Menutup Pop Up dan Kembali */}
          </Route>
        </Route>

        {/* Route Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

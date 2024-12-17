import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/header";
import Dashboard from "./pages/dashboard";
import TeamTable from "./pages/Team";
import LoginPage from "./pages/auth/loginPage";
import LoginLayout from "./layout/layoutLogin";
import NotFound from "./pages/notFound";

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
        </Route>

        {/* Route Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;

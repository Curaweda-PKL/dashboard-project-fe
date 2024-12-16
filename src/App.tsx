import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/header";
import Dashboard from "./pages/dashboard";
import TeamTable from "./pages/Team";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<TeamTable />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;


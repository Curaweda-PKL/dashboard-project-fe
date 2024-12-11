import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayoutProject from "./layout/layoutProject";
import Dashboard from "./component/dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <LayoutProject>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </LayoutProject>
    </Router>
  );
};

export default App;

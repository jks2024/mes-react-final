import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MesLayout from "./layouts/MesLayout";
import DashboardPage from "./pages/DashboardPage";
import WorkOrderPage from "./pages/WorkOrderPage";
import MaterialPage from "./pages/MaterialPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route element={<MesLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/order" element={<WorkOrderPage />} />
          <Route path="/material" element={<MaterialPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

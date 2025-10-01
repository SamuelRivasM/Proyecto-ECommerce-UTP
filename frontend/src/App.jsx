
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ClienteDashboard from "./components/Dashboard/ClienteDashboard";
import CocinaDashboard from "./components/Dashboard/CocinaDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Dashboards por rol */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
        <Route path="/cocina-dashboard" element={<CocinaDashboard />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

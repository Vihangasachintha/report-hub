import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyReports from "./pages/MyReports";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Projects from "./pages/Projects";
import Report from "./pages/Report";

function App() {
  return (
    <Routes>
      {/* When app starts, go to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Register page */}
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/my-reports/report" element={<Report />} />
          <Route path="/my-reports/report/:id" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

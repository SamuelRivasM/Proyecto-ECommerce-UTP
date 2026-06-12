
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Contexto del Carrito
import { CartProvider } from "./context/CartContext";

// Rutas Autenticación
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import AuthSessionSync from "./components/Auth/AuthSessionSync";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Rutas Dashboard
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ClienteDashboard from "./components/Dashboard/ClienteDashboard";
import CocinaDashboard from "./components/Dashboard/CocinaDashboard";

// Rutas Admin
import AdminUsuarios from "./components/Admin/AdminUsuarios";
import AdminReportes from "./components/Admin/AdminReportes";

// Rutas Cliente
import ClienteProductos from "./components/Cliente/ClienteProductos";
import ClientePedidos from "./components/Cliente/ClientePedidos";
import ClienteCarrito from "./components/Cart/ClienteCarrito";

// Rutas Cocina
import CocinaProductos from "./components/Cocina/CocinaProductos";
import CocinaPedidos from "./components/Cocina/CocinaPedidos";

// Rutas Globales
import ContactoSection from "./components/Layout/ContactoSection";
import LandbotChat from "./components/Layout/LandbotChat";

// Subcomponente para controlar cuándo se muestra el chatbot
const ConditionalLandbot = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const publicRoutes = ["/", "/register", "/forgot-password"];

  const isPublicRoute =
    publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

  if (!token || !user || isPublicRoute) {
    return null;
  }

  return <LandbotChat />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Sincronización de sesión autenticada */}
        <AuthSessionSync />

        {/* Render condicional del chatbot */}
        <ConditionalLandbot />

        <Routes>
          {/* Vista de Autenticación */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Vista de Dashboards por Rol */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente-dashboard"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <ClienteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cocina-dashboard"
            element={
              <ProtectedRoute allowedRoles={["cocina"]}>
                <CocinaDashboard />
              </ProtectedRoute>
            }
          />

          {/* Vista de Rol Admin */}
          <Route
            path="/admin-usuarios"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-reportes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReportes />
              </ProtectedRoute>
            }
          />

          {/* Vista de Rol Clientes */}
          <Route
            path="/cliente-productos"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <ClienteProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente-pedidos"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <ClientePedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente-carrito"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <ClienteCarrito />
              </ProtectedRoute>
            }
          />

          {/* Vistas del Rol Cocina */}
          <Route
            path="/cocina-productos"
            element={
              <ProtectedRoute allowedRoles={["cocina"]}>
                <CocinaProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cocina-pedidos"
            element={
              <ProtectedRoute allowedRoles={["cocina"]}>
                <CocinaPedidos />
              </ProtectedRoute>
            }
          />

          {/* Contacto global */}
          <Route path="/contacto" element={<ContactoSection />} />

        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </CartProvider>
  );
}

export default App;

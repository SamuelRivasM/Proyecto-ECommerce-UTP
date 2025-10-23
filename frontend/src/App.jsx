
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Vista de Autenticación */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Vista de Dashboards por Rol */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
          <Route path="/cocina-dashboard" element={<CocinaDashboard />} />

          {/* Vista de Rol Admin */}
          <Route path="/admin-usuarios" element={<AdminUsuarios />} />
          <Route path="/admin-reportes" element={<AdminReportes />} />

          {/* Vista de Rol Clientes */}
          <Route path="/cliente-productos" element={<ClienteProductos />} />
          <Route path="/cliente-pedidos" element={<ClientePedidos />} />
          <Route path="/cliente-carrito" element={<ClienteCarrito />} />

          {/* Vistas del Rol Cocina */}
          <Route path="/cocina-productos" element={<CocinaProductos />} />
          <Route path="/cocina-pedidos" element={<CocinaPedidos />} />

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

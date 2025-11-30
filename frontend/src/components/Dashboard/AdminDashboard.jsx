
// src/components/Dashboard/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showPerfil, setShowPerfil] = useState(false);

  const [filtroPedidos, setFiltroPedidos] = useState("mes");
  const [filtroVentas, setFiltroVentas] = useState("mes");
  const [filtroProductos, setFiltroProductos] = useState("mes");

  const [stats, setStats] = useState({
    totalUsuarios: 0,
    clientes: 0,
    admins: 0,
    cocina: 0,
    pedidosMes: 0,
    ventasMes: 0,
  });
  const [productosTop, setProductosTop] = useState([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Validar token y cargar estadísticas iniciales
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [resUsuarios, resRecientes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/admin/stats/usuarios`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/stats/usuarios-recientes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats((prev) => ({ ...prev, ...resUsuarios.data }));
        setUsuariosRecientes(resRecientes.data);
      } catch (err) {
        console.error("Error al cargar datos iniciales del admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Pedidos
  useEffect(() => {
    if (!token) return;
    const fetchPedidos = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats/pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { periodo: filtroPedidos },
        });
        setStats((prev) => ({ ...prev, pedidosMes: res.data.total }));
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      }
    };
    fetchPedidos();
  }, [filtroPedidos, token]);

  // Ventas
  useEffect(() => {
    if (!token) return;
    const fetchVentas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats/ventas`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { periodo: filtroVentas },
        });
        setStats((prev) => ({ ...prev, ventasMes: res.data.total }));
      } catch (err) {
        console.error("Error cargando ventas:", err);
      }
    };
    fetchVentas();
  }, [filtroVentas, token]);

  // Productos más vendidos
  useEffect(() => {
    if (!token) return;
    const fetchProductos = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats/productos`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { periodo: filtroProductos },
        });
        setProductosTop(res.data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    };
    fetchProductos();
  }, [filtroProductos, token]);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Spinner de carga
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const opcionesFiltro = [
    { value: "dia", label: "Día" },
    { value: "semana", label: "Semana" },
    { value: "mes", label: "Mes" },
    { value: "trimestre", label: "Trimestre" },
    { value: "semestre", label: "Semestre" },
    { value: "año", label: "Año" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FAF7F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar General */}
      <NavbarGeneral
        onPerfilClick={() => setShowPerfil(true)}
        onLogout={handleLogout}
        onInicioClick={() => navigate("/admin-dashboard")}
        activePage="inicio"
      />

      {/* === Contenido principal === */}
      <main className="container my-5 flex-grow">
        <h2 className="fw-bold mb-4">Panel de Administración</h2>

        {/* === Tarjetas de estadísticas === */}
        <div className="row g-4 mb-5">
          {/* Usuarios */}
          <div className="col-md-4">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Usuarios Registrados</h5>
                <p className="display-6 fw-bold">{stats.totalUsuarios}</p>
                <small>
                  Clientes: {stats.clientes} | Cocina: {stats.cocina} | Admins: {stats.admins}
                </small>
              </div>
            </div>
          </div>

          {/* Pedidos */}
          <div className="col-md-4">
            <div className="card shadow-sm text-center position-relative">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Cantidad de Pedidos</h5>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={filtroPedidos}
                    onChange={(e) => setFiltroPedidos(e.target.value)}
                  >
                    {opcionesFiltro.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="display-6 fw-bold">{stats.pedidosMes}</p>
                <small>Periodo: {filtroPedidos}</small>
              </div>
            </div>
          </div>

          {/* Ventas Totales */}
          <div className="col-md-4">
            <div className="card shadow-sm text-center position-relative">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Ventas Totales</h5>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={filtroVentas}
                    onChange={(e) => setFiltroVentas(e.target.value)}
                  >
                    {opcionesFiltro.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="display-6 fw-bold">S/ {stats.ventasMes}</p>
                <small>Periodo: {filtroVentas}</small>
              </div>
            </div>
          </div>
        </div>

        {/* === Productos más vendidos === */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Productos más vendidos</h4>
            <select
              className="form-select form-select-sm w-auto"
              value={filtroProductos}
              onChange={(e) => setFiltroProductos(e.target.value)}
            >
              {opcionesFiltro.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Ventas</th>
              </tr>
            </thead>
            <tbody>
              {productosTop.length > 0 ? (
                productosTop.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nombre}</td>
                    <td>{p.cantidad}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* === Últimos usuarios registrados === */}
        <div>
          <h4 className="mb-3">Últimos usuarios registrados</h4>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuariosRecientes.length > 0 ? (
                usuariosRecientes.map((u, i) => (
                  <tr key={i}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>{new Date(u.fecha_registro).toLocaleDateString("es-PE")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay usuarios recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Chatbot de Landbot */}
      <LandbotChat />

      {/* Footer */}
      <FooterGeneral />

      {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
    </div>
  );
};

export default AdminDashboard;

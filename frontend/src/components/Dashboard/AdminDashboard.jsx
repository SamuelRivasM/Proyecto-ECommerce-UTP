
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Perfil from "../Layout/Perfil";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showPerfil, setShowPerfil] = useState(false);

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

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(res.data.stats || {});
        setProductosTop(res.data.productosTop || []);
        setUsuariosRecientes(res.data.usuariosRecientes || []);
      } catch (err) {
        console.error("Error cargando estadísticas", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#FAF7F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#A4001D" }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold" href="/admin-dashboard">
            UTP COFFEE POINT - Admin
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/admin-dashboard">
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Usuarios
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Productos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pedidos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Reportes
                </a>
              </li>

              {/* Dropdown Usuario */}
              <li className="nav-item dropdown ms-3">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <FaUserCircle size={22} className="me-1" />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setShowPerfil(true)}
                    >
                      Perfil
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container my-5 flex-grow">
        <h2 className="fw-bold mb-4">Panel de Administración</h2>

        {/* Tarjetas de estadísticas */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Usuarios Registrados</h5>
                <p className="display-6 fw-bold">{stats.totalUsuarios}</p>
                <small>
                  Clientes: {stats.clientes} | Cocina: {stats.cocina} | Admins:{" "}
                  {stats.admins}
                </small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Cantidad de Pedidos</h5>
                <p className="display-6 fw-bold">{stats.pedidosMes}</p>
                <small>Periodo: Mes actual</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm text-center">
              <div className="card-body">
                <h5 className="card-title">Ventas Totales</h5>
                <p className="display-6 fw-bold">S/ {stats.ventasMes}</p>
                <small>Periodo: Mes actual</small>
              </div>
            </div>
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="mb-5">
          <h4 className="mb-3">Productos más vendidos</h4>
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

        {/* Últimos usuarios registrados */}
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
                    <td>
                      {new Date(u.fecha_registro).toLocaleDateString("es-PE")}
                    </td>
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

      {/* Footer */}
      <footer
        className="text-white mt-auto py-4"
        style={{ backgroundColor: "#A4001D" }}
      >
        <div className="container text-center">
          <h5 className="mb-3">
            Universidad Tecnológica del Perú - Sede Lima Sur
          </h5>
          <p className="mb-2">
            Inicio de la Panamericana Sur — ingreso a Villa El Salvador (VES),
            Lima Sur
          </p>
          <div className="d-flex justify-content-center mb-3">
            <div style={{ width: "600px", height: "400px" }}>
              <iframe
                src="https://www.google.com/maps?q=UTP+Lima+Sur+Panamericana+Villa+El+Salvador&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa UTP Lima Sur"
              ></iframe>
            </div>
          </div>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Universidad Tecnológica del Perú -
            Todos los derechos reservados
          </p>
        </div>
      </footer>

      {/* Perfil modal */}
      {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
    </div>
  );
};

export default AdminDashboard;

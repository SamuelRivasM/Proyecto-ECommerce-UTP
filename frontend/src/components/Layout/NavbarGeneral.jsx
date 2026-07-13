
// src/components/Layout/NavbarGeneral.jsx
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./navbarGeneral.css";

const NavbarGeneral = ({
    onPerfilClick = () => { },
    onLogout = () => { },
    onInicioClick = () => { },
    activePage = "inicio",
}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const rol = user?.rol || "cliente";
    const { cartCount } = useCart(); // contador global del carrito en el navbar

    // Opciones visibles según el rol (todos aplicados :D)
    const menuPorRol = {
        admin: [
            { nombre: "Inicio", ruta: "/admin-dashboard", accion: () => navigate("/admin-dashboard") },
            { nombre: "Usuarios", ruta: "/admin-usuarios", accion: () => navigate("/admin-usuarios") },
            { nombre: "Reportes", ruta: "/admin-reportes", accion: () => navigate("/admin-reportes") },
            { nombre: "Contacto", ruta: "/contacto", accion: () => navigate("/contacto") },
        ],
        cocina: [
            { nombre: "Inicio", ruta: "/cocina-dashboard", accion: () => navigate("/cocina-dashboard") },
            { nombre: "Lista de Pedidos", ruta: "/cocina-pedidos", accion: () => navigate("/cocina-pedidos") },
            { nombre: "Lista de Productos", ruta: "/cocina-productos", accion: () => navigate("/cocina-productos") },
            { nombre: "Contacto", ruta: "/contacto", accion: () => navigate("/contacto") },
        ],
        cliente: [
            { nombre: "Inicio", ruta: "/cliente-dashboard", accion: () => navigate("/cliente-dashboard") },
            { nombre: "Productos", ruta: "/cliente-productos", accion: () => navigate("/cliente-productos") },
            { nombre: "Mis Pedidos", ruta: "/cliente-pedidos", accion: () => navigate("/cliente-pedidos") },
            { nombre: "Carrito", ruta: "/cliente-carrito", accion: () => navigate("/cliente-carrito"), esCarrito: true },
            { nombre: "Contacto", ruta: "/contacto", accion: () => navigate("/contacto") },
        ],
    };

    const opciones = menuPorRol[rol] || menuPorRol["cliente"];

    const inicioRutaPorRol = {
        admin: "/admin-dashboard",
        cocina: "/cocina-dashboard",
        cliente: "/cliente-dashboard",
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#A4001D" }}>
            <div className="container">
                <Link
                    to={inicioRutaPorRol[rol] || "/cliente-dashboard"}
                    className="navbar-brand fw-bold"
                    onClick={(e) => { e.preventDefault(); onInicioClick(); }}
                    aria-hidden="true"
                    tabIndex="-1"
                >
                    UTP COFFEE POINT{" "}
                    {rol !== "cliente" && `- ${rol.charAt(0).toUpperCase() + rol.slice(1)}`}
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Abrir menú de navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {opciones.map((op, i) => (
                            <li className="nav-item position-relative" key={i}>
                                <Link
                                    to={op.ruta}
                                    className={`nav-link ${activePage === op.nombre.toLowerCase() ? "active fw-semibold" : ""} d-flex align-items-center gap-1`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        op.accion();
                                    }}
                                >
                                    {/* Si es el ítem de carrito, muestra el ícono y contador */}
                                    {op.esCarrito ? (
                                        <div className="carrito-icono-container">
                                            {cartCount > 0 && (
                                                <span className="carrito-badge">{cartCount}</span>
                                            )}
                                            <FaShoppingCart size={18} className="me-1" aria-hidden="true" />
                                            {op.nombre}
                                        </div>
                                    ) : (
                                        op.nombre
                                    )}
                                </Link>
                            </li>
                        ))}

                        <li className="nav-item dropdown ms-3">
                            <Link
                                to="#"
                                className="nav-link dropdown-toggle d-flex align-items-center"
                                id="userDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                aria-label="Menú de usuario"
                            >
                                <FaUserCircle size={22} className="me-1" aria-hidden="true" />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                <li><button className="dropdown-item" onClick={onPerfilClick}>Perfil</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={onLogout}>Cerrar sesión</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarGeneral;

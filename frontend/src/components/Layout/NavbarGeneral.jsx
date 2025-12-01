
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
            { nombre: "Inicio", accion: () => navigate("/admin-dashboard") },
            { nombre: "Usuarios", accion: () => navigate("/admin-usuarios") },
            { nombre: "Reportes", accion: () => navigate("/admin-reportes") },
            { nombre: "Contacto", accion: () => navigate("/contacto") },
        ],
        cocina: [
            { nombre: "Inicio", accion: () => navigate("/cocina-dashboard") },
            { nombre: "Lista de Pedidos", accion: () => navigate("/cocina-pedidos") },
            { nombre: "Lista de Productos", accion: () => navigate("/cocina-productos") },
            { nombre: "Contacto", accion: () => navigate("/contacto") },
        ],
        cliente: [
            { nombre: "Inicio", accion: () => navigate("/cliente-dashboard") },
            { nombre: "Productos", accion: () => navigate("/cliente-productos") },
            { nombre: "Mis Pedidos", accion: () => navigate("/cliente-pedidos") },
            { nombre: "Carrito", accion: () => navigate("/cliente-carrito"), esCarrito: true },
            { nombre: "Contacto", accion: () => navigate("/contacto") },
        ],
    };

    const opciones = menuPorRol[rol] || menuPorRol["cliente"];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#A4001D" }}>
            <div className="container">
                <Link to="" className="navbar-brand fw-bold" onClick={(e) => { e.preventDefault(); onInicioClick(); }}>
                    UTP COFFEE POINT{" "}
                    {rol !== "cliente" && `- ${rol.charAt(0).toUpperCase() + rol.slice(1)}`}
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {opciones.map((op, i) => (
                            <li className="nav-item position-relative" key={i}>
                                <Link
                                    to=""
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
                                            <FaShoppingCart size={18} className="me-1" />
                                            {op.nombre}
                                        </div>
                                    ) : (
                                        op.nombre
                                    )}
                                </Link>
                            </li>
                        ))}

                        <li className="nav-item dropdown ms-3">
                            <Link to="" className="nav-link dropdown-toggle d-flex align-items-center" id="userDropdown" data-bs-toggle="dropdown">
                                <FaUserCircle size={22} className="me-1" />
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

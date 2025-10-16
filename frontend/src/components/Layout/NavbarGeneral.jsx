
// src/components/Layout/NavbarGeneral.jsx
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavbarGeneral = ({
    onPerfilClick = () => { },
    onLogout = () => { },
    onInicioClick = () => { },
    activePage = "inicio",
}) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const rol = user?.rol || "cliente";

    // Configura las opciones visibles según el rol
    const menuPorRol = {
        admin: [
            { nombre: "Inicio", accion: onInicioClick },
            { nombre: "Usuarios", accion: () => navigate("/admin-dashboard#usuarios") }, // para luego
            { nombre: "Reportes", accion: () => navigate("/admin-dashboard#reportes") }, // para luego
            { nombre: "Contacto", accion: () => navigate("/contacto") }, // aplicado
        ],
        cocina: [
            { nombre: "Inicio", accion: onInicioClick },
            { nombre: "Lista de Pedidos", accion: () => navigate("/cocina-dashboard#pedidos") }, // para luego
            { nombre: "Lista de Productos", accion: () => navigate("/cocina-dashboard#productos") }, // para luego
            { nombre: "Contacto", accion: () => navigate("/contacto") }, // aplicado
        ],
        cliente: [
            { nombre: "Inicio", accion: onInicioClick },
            { nombre: "Productos", accion: () => navigate("/cliente-productos") }, // aplicado
            { nombre: "Mis Pedidos", accion: () => navigate("/cliente-dashboard#pedidos") }, // para luego
            { nombre: "Carrito", accion: () => navigate("/cliente-dashboard#carrito") }, // para luego
            { nombre: "Contacto", accion: () => navigate("/contacto") }, // aplicado
        ],
    };

    const opciones = menuPorRol[rol] || menuPorRol["cliente"];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#A4001D" }}>
            <div className="container">
                <a
                    className="navbar-brand fw-bold"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onInicioClick();
                    }}
                >
                    UTP COFFEE POINT {rol !== "cliente" && `- ${rol.charAt(0).toUpperCase() + rol.slice(1)}`}
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {opciones.map((op, i) => (
                            <li className="nav-item" key={i}>
                                <a
                                    href="#"
                                    className={`nav-link ${activePage === op.nombre.toLowerCase() ? "active fw-semibold" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        op.accion();
                                    }}
                                >
                                    {op.nombre}
                                </a>
                            </li>
                        ))}

                        {/* Dropdown usuario */}
                        <li className="nav-item dropdown ms-3">
                            <a
                                className="nav-link dropdown-toggle d-flex align-items-center"
                                href="#"
                                id="userDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <FaUserCircle size={22} className="me-1" />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                <li>
                                    <button className="dropdown-item" onClick={onPerfilClick}>
                                        Perfil
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={onLogout}>
                                        Cerrar sesión
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarGeneral;

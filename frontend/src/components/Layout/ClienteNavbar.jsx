
import { FaUserCircle } from "react-icons/fa";

const ClienteNavbar = ({ onPerfilClick, onLogout, onContactClick, activePage, onInicioClick }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#A4001D" }}>
            <div className="container">
                <a className="navbar-brand fw-bold" href="/cliente-dashboard">
                    UTP COFFEE POINT
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
                        {/* Inicio */}
                        <li className="nav-item">
                            <a
                                href="#inicio"
                                className={`nav-link ${activePage === "inicio" ? "active fw-semibold" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault(); // evita recarga
                                    onInicioClick();
                                }}
                            >
                                Inicio
                            </a>
                        </li>

                        {/* Otras secciones */}
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Productos
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Mis Pedidos
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Carrito
                            </a>
                        </li>

                        {/* Contacto */}
                        <li className="nav-item">
                            <a
                                href="#contacto"
                                className={`nav-link ${activePage === "contacto" ? "active fw-semibold" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault(); // evita recarga
                                    onContactClick();
                                }}
                            >
                                Contacto
                            </a>
                        </li>

                        {/* Usuario */}
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
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
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

export default ClienteNavbar;

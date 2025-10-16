
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarGeneral from "../Layout/NavbarGeneral";
import Perfil from "../Layout/Perfil";
import { FaCoffee, FaUtensils, FaIceCream } from "react-icons/fa";

const ClienteProductos = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        // Aquí podrías traer productos del backend más adelante
        setProductos([
            {
                id: 1,
                nombre: "Café Americano",
                descripcion: "Aromático café recién preparado, tamaño mediano.",
                precio: 4.5,
                icon: <FaCoffee size={30} color="#A4001D" />,
            },
            {
                id: 2,
                nombre: "Sandwich de Pollo",
                descripcion: "Pan artesanal con pollo, lechuga y mayonesa.",
                precio: 7.0,
                icon: <FaUtensils size={30} color="#A4001D" />,
            },
            {
                id: 3,
                nombre: "Helado de Vainilla",
                descripcion: "Helado artesanal de vainilla con topping de chocolate.",
                precio: 3.5,
                icon: <FaIceCream size={30} color="#A4001D" />,
            },
        ]);
    }, []);

    return (
        <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={handleLogout}
                onInicioClick={() => navigate("/cliente-dashboard")}
                activePage="productos"
            />

            {/* Contenido */}
            <section className="container my-5 flex-grow">
                <h2 className="fw-bold text-center mb-4">Nuestros Productos</h2>
                <p className="text-center mb-5 text-muted">
                    Explora nuestras opciones deliciosas y realiza tu pedido en línea.
                </p>

                <div className="row g-4">
                    {productos.map((prod) => (
                        <div key={prod.id} className="col-md-4">
                            <div
                                className="card shadow-sm h-100 border-0"
                                style={{ borderRadius: "16px" }}
                            >
                                <div className="card-body text-center">
                                    <div className="mb-3">{prod.icon}</div>
                                    <h5 className="fw-bold mb-2">{prod.nombre}</h5>
                                    <p className="text-muted mb-3">{prod.descripcion}</p>
                                    <p className="fw-semibold mb-3">
                                        S/ {prod.precio.toFixed(2)}
                                    </p>
                                    <button className="btn btn-danger btn-sm">
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-white mt-auto py-3" style={{ backgroundColor: "#A4001D" }}>
                <div className="container text-center">
                    <p className="mb-1">&copy; {new Date().getFullYear()} Universidad Tecnológica del Perú - Todos los derechos reservados.</p>
                </div>
            </footer>

            {/* Modal Perfil */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ClienteProductos;

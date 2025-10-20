
// src/Products/ClienteProductos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import Perfil from "../Layout/Perfil";
import "./clienteProductos.css";

// íconos de Productos
import { FaCoffee, FaUtensils, FaIceCream } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
import { LuSandwich } from "react-icons/lu";
import { FaCookieBite } from "react-icons/fa6";

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
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/productos/disponibles`);
                setProductos(response.data);
            } catch (error) {
                toast.error("Error al obtener productos");
                console.error("Error al obtener productos:", error);
            }
        };
        fetchProductos();
    }, []);

    const obtenerIcono = (categoria) => {
        switch (categoria?.toLowerCase()) {
            case "bebidas calientes":
                return <FaCoffee size={22} color="#A4001D" />;
            case "bebidas frías":
                return <FaBottleWater size={22} color="#A4001D" />;
            case "postres":
                return <FaIceCream size={22} color="#A4001D" />;
            case "sandwiches":
                return <LuSandwich size={22} color="#A4001D" />;
            case "snacks":
                return <FaCookieBite size={22} color="#A4001D" />;
            default:
                return <FaUtensils size={22} color="#A4001D" />;
        }
    };

    return (
        <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={handleLogout}
                onInicioClick={() => navigate("/cliente-dashboard")}
                activePage="productos"
            />

            {/* === Contenido principal === */}
            <section className="container my-5 flex-grow">
                <h2 className="fw-bold text-center mb-4">Nuestros Productos</h2>
                <p className="text-center mb-5 text-muted">
                    Explora nuestras opciones deliciosas y realiza tu pedido en línea.
                </p>

                <div className="row g-4">
                    {productos.map((prod) => (
                        <div key={prod.id} className="col-md-4">
                            <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                <div className="card-img-top position-relative">
                                    {prod.imagen ? (
                                        <img
                                            src={prod.imagen}
                                            alt={prod.nombre}
                                            className="product-image"
                                        />
                                    ) : (
                                        <div className="product-image">
                                            Sin imagen
                                        </div>
                                    )}
                                    <div className="category-icon" title={prod.categoria}>
                                        {obtenerIcono(prod.categoria)}
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="fw-bold mb-2">{prod.nombre}</h5>
                                    <p className="text-muted mb-3">{prod.descripcion}</p>
                                    <p className="fw-semibold mb-3">S/ {parseFloat(prod.precio).toFixed(2)}</p>
                                    <button className="btn btn-danger btn-sm">Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ClienteProductos;

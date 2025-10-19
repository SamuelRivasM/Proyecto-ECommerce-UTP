// src/Products/ClienteProductos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCoffee, FaUtensils, FaIceCream } from "react-icons/fa";
import NavbarGeneral from "../Layout/NavbarGeneral";
import Perfil from "../Layout/Perfil";

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
                const response = await fetch("http://localhost:3000/api/productos");
                if (!response.ok) throw new Error("Error al obtener productos");
                const data = await response.json();
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };
        fetchProductos();
    }, []);

    const obtenerIcono = (categoria) => {
        switch (categoria?.toLowerCase()) {
            case "bebidas":
                return <FaCoffee size={30} color="#A4001D" />;
            case "postres":
                return <FaIceCream size={30} color="#A4001D" />;
            default:
                return <FaUtensils size={30} color="#A4001D" />;
        }
    };

    return (
        <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={handleLogout}
                onInicioClick={() => navigate("/cliente-dashboard")}
                activePage="productos"
            />

            <section className="container my-5 flex-grow">
                <h2 className="fw-bold text-center mb-4">Nuestros Productos</h2>
                <p className="text-center mb-5 text-muted">
                    Explora nuestras opciones deliciosas y realiza tu pedido en línea.
                </p>

                <div className="row g-4">
                    {productos.map((prod) => (
                        <div key={prod.id} className="col-md-4">
                            <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px" }}>
                                <div className="card-body text-center">
                                    <div className="mb-3">{obtenerIcono(prod.categoria)}</div>
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

            <footer className="text-white mt-auto py-3" style={{ backgroundColor: "#A4001D" }}>
                <div className="container text-center">
                    <p className="mb-1">
                        &copy; {new Date().getFullYear()} Universidad Tecnológica del Perú - Todos los derechos reservados.
                    </p>
                </div>
            </footer>

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ClienteProductos;

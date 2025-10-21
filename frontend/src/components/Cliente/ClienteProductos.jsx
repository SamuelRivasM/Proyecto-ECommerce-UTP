
// src/Cliente/ClienteProductos.jsx
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
    const [criterio, setCriterio] = useState("todos");
    const [filtro, setFiltro] = useState("");
    const [categoriaVisible, setCategoriaVisible] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/productos/cliente`);
                setProductos(response.data);
            } catch (error) {
                toast.error("Error al obtener productos");
                console.error("Error al obtener productos:", error);
            }
        };
        fetchProductos();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Si haces click fuera del icono de categoría, se cierra
            if (!e.target.closest(".category-icon")) {
                setCategoriaVisible(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
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

    // === Nuevo filtrado ===
    const productosFiltrados = productos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "nombre":
                return p.nombre.toLowerCase().includes(valor);
            case "descripcion":
                return p.descripcion.toLowerCase().includes(valor);
            case "precio":
                return p.precio.toString().includes(valor);
            case "categoria":
                return p.categoria.toLowerCase().includes(valor);
            default:
                return true;
        }
    });

    const toggleCategoria = (id) => {
        setCategoriaVisible((prev) => (prev === id ? null : id));
    };

    // Función para Agregar al Carrito
    const handleAgregarAlCarrito = (prod) => {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.some((p) => p.id === prod.id)) {
            toast.info("El producto ya está en el carrito.");
            return;
        }
        carrito.push({
            ...prod,
            numero: carrito.length + 1,
            precio: parseFloat(prod.precio),
            cantidad: 1,
            subtotal: parseFloat(prod.precio),
        });
        localStorage.setItem("carrito", JSON.stringify(carrito));
        toast.success("Se agregó el producto al carrito correctamente.");
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
                <p className="text-center mb-4 text-muted">
                    Explora nuestras opciones deliciosas y realiza tu pedido en línea.
                </p>

                {/* === Filtro === */}
                <div className="input-group mb-5 shadow-sm" style={{ maxWidth: "650px", margin: "0 auto", height: "50px" }}>
                    <span className="input-group-text bg-white border-end-0" style={{ fontSize: "1.2rem", height: "50px" }}>🔍</span>
                    <select
                        className="form-select border-start-0 border-end-0"
                        value={criterio}
                        onChange={(e) => {
                            setCriterio(e.target.value);
                            setFiltro("");
                        }}
                        style={{ maxWidth: "180px", height: "50px" }}
                    >
                        <option value="todos">Todos</option>
                        <option value="nombre">Nombre</option>
                        <option value="descripcion">Descripción</option>
                        <option value="precio">Precio</option>
                        <option value="categoria">Categoría</option>
                    </select>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder={criterio === "todos" ? "Mostrar todos" : `Buscar por ${criterio}...`}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        disabled={criterio === "todos"}
                        style={{
                            height: "50px",
                            backgroundColor: criterio === "todos" ? "#f5f5f5" : "white",
                        }}
                    />
                </div>

                {/* === Cards === */}
                <div className="row g-4">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((prod) => (
                            <div key={prod.id} className="col-md-4">
                                <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                    <div className="card-img-top position-relative">
                                        {prod.imagen ? (
                                            <img src={prod.imagen} alt={prod.nombre} className="product-image" />
                                        ) : (
                                            <div className="product-image">Sin imagen</div>
                                        )}
                                        <div
                                            className="category-icon"
                                            onClick={() => toggleCategoria(prod.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {obtenerIcono(prod.categoria)}

                                            {/* Franja deslizante de categoría */}
                                            <div
                                                className={`categoria-slide ${categoriaVisible === prod.id ? "visible" : ""}`}
                                            >
                                                {prod.categoria}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body text-center">
                                        <h5 className="fw-bold mb-2">{prod.nombre}</h5>
                                        <p className="text-muted mb-3">{prod.descripcion}</p>
                                        <p className="fw-semibold mb-3">S/ {parseFloat(prod.precio).toFixed(2)}</p>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleAgregarAlCarrito(prod)}
                                        >
                                            Agregar al carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No se encontraron productos.</p>
                    )}
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

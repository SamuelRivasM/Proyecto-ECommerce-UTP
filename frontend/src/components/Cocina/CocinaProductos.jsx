
// src/components/Cocina/CocinaProductos.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import "./cocinaProductos.css";

const CocinaProductos = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");
    const itemsPorPagina = 15;

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/productos/todos`);
                setProductos(response.data);
            } catch {
                toast.error("Error al obtener productos");
            }
        };
        fetchProductos();
    }, []);

    // Subida de imagen con Cloudinary
    const handleCambiarImg = async (idProducto) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("imagen", file);

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/productos/upload/${idProducto}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                setProductos((prev) =>
                    prev.map((p) =>
                        p.id === idProducto ? { ...p, imagen: response.data.url } : p
                    )
                );

                toast.success("✅ Imagen actualizada correctamente");
            } catch (error) {
                console.error("Error al subir imagen:", error);
                toast.error("❌ Error al subir imagen");
            }
        };

        input.click();
    };

    // Filtrado
    const productosFiltrados = productos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "id":
                return p.id.toString() === valor;
            case "nombre":
                return p.nombre.toLowerCase().includes(valor);
            case "descripcion":
                return p.descripcion.toLowerCase().includes(valor);
            case "precio":
                return p.precio.toString().includes(valor);
            case "stock":
                return p.stock.toString().includes(valor);
            case "categoria":
                return p.categoria.toLowerCase().includes(valor);
            case "estado":
                return (p.disponible ? "activo" : "inactivo").includes(valor);
            default:
                return true;
        }
    });

    // Paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
    const inicio = (currentPage - 1) * itemsPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, inicio + itemsPorPagina);

    return (
        <div className="section-container">
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={() => window.location.replace("/")}
                onInicioClick={() => window.location.replace("/cocina-dashboard")}
                activePage="lista de productos"
            />

            {/* === Contenido principal === */}
            <div className="container my-4">
                <h2 className="fw-bold text-center mb-4">Lista de Productos</h2>

                {/* === Filtro === */}
                <div className="input-group mb-4 shadow-sm" style={{ maxWidth: "650px", height: "50px" }}>
                    <span className="input-group-text bg-white border-end-0" style={{ fontSize: "1.2rem", height: "50px" }}>🔍</span>
                    <select
                        className="form-select border-start-0 border-end-0"
                        value={criterio}
                        onChange={(e) => {
                            setCriterio(e.target.value);
                            setFiltro("");
                        }}
                        style={{ maxWidth: "150px", height: "50px" }}
                    >
                        <option value="todos">Todos</option>
                        <option value="id">ID</option>
                        <option value="nombre">Nombre</option>
                        <option value="descripcion">Descripción</option>
                        <option value="precio">Precio (S/)</option>
                        <option value="stock">Stock</option>
                        <option value="categoria">Categoría</option>
                        <option value="estado">Estado</option>
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

                {/* === Tabla === */}
                <div className="table-container">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio (S/)</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosPagina.length > 0 ? (
                                productosPagina.map((prod) => (
                                    <tr key={prod.id}>
                                        <td data-label="ID">{prod.id}</td>
                                        <td data-label="Imagen">
                                            {prod.imagen ? (
                                                <img
                                                    src={prod.imagen}
                                                    alt={prod.nombre}
                                                    className="product-image"
                                                />
                                            ) : (
                                                <div className="no-img">Sin IMG</div>
                                            )}
                                        </td>
                                        <td data-label="Nombre:">{prod.nombre}</td>
                                        <td data-label="Descripción:">{prod.descripcion}</td>
                                        <td data-label="Precio (S/):">{prod.precio}</td>
                                        <td data-label="Stock:">{prod.stock}</td>
                                        <td data-label="Categoría:">{prod.categoria}</td>
                                        <td data-label="Estado:">{prod.disponible ? "Activo" : "Inactivo"}</td>
                                        <td data-label="Acciones:" className="action-buttons">
                                            <button className="btn btn-sm btn-primary">Editar</button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleCambiarImg(prod.id)}
                                            >
                                                Cambiar IMG
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        No se encontraron resultados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="pagination">
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default CocinaProductos;

// src/components/Cocina/CocinaPedidos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import "./cocinaPedidos.css";

const CocinaPedidos = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // === Obtener pedidos desde el backend ===
    useEffect(() => {
        const obtenerPedidos = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/pedidos/cocina/pedidos-ordenados`
                );
                setPedidos(response.data);
            } catch (error) {
                console.error("Error al obtener pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerPedidos();
    }, []);

    // === Filtrado ===
    const pedidosFiltrados = pedidos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "id":
                return p.id?.toString() === valor;
            case "cliente":
                return p.cliente_nombre?.toLowerCase().includes(valor);
            case "metodo_pago":
                return p.metodo_pago?.toLowerCase().includes(valor);
            case "estado":
                return p.estado?.toLowerCase().includes(valor);
            case "total":
                return p.total?.toString().includes(valor);
            case "fecha":
                return p.fecha_creacion?.toLowerCase().includes(valor);
            default:
                return true;
        }
    });

    // === Paginación ===
    const itemsPorPagina = 12;
    const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);
    const inicio = (currentPage - 1) * itemsPorPagina;
    const pedidosPagina = pedidosFiltrados.slice(inicio, inicio + itemsPorPagina);

    return (
        <div className="section-container">
            {/* Navbar */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={() => window.location.replace("/")}
                onInicioClick={() => window.location.replace("/cocina-dashboard")}
                activePage="lista de pedidos"
            />

            <div className="container my-4">
                <h2 className="fw-bold text-center mb-4">Lista de Pedidos</h2>

                {/* === Barra de búsqueda === */}
                <div
                    className="input-group mb-4 shadow-sm"
                    style={{ maxWidth: "650px", height: "50px" }}
                >
                    <span
                        className="input-group-text bg-white border-end-0"
                        style={{ fontSize: "1.2rem", height: "50px" }}
                    >
                        🔍
                    </span>
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
                        <option value="cliente">Cliente</option>
                        <option value="metodo_pago">Método de Pago</option>
                        <option value="estado">Estado</option>
                        <option value="total">Total (S/)</option>
                        <option value="fecha">Fecha</option>
                    </select>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder={
                            criterio === "todos"
                                ? "Mostrar todos"
                                : `Buscar por ${criterio}...`
                        }
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        disabled={criterio === "todos"}
                        style={{
                            height: "50px",
                            backgroundColor:
                                criterio === "todos" ? "#f5f5f5" : "white",
                        }}
                    />
                </div>

                {/* === Contenido principal === */}
                {loading ? (
                    <p className="text-center">Cargando pedidos...</p>
                ) : pedidosPagina.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {pedidosPagina.map((p) => (
                            <div className="col" key={p.id}>
                                <div
                                    className={`card shadow-sm border-${p.estado === "entregado"
                                        ? "success"
                                        : p.estado === "listo"
                                            ? "primary"
                                            : p.estado === "en_preparacion"
                                                ? "warning"
                                                : "secondary"
                                        }`}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">
                                            Pedido #{p.id}
                                        </h5>
                                        <p className="card-text mb-1">
                                            <strong>Cliente:</strong>{" "}
                                            {p.cliente_nombre}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Método de pago:</strong>{" "}
                                            {p.metodo_pago}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Total:</strong> S/{" "}
                                            {parseFloat(p.total).toFixed(2)}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Fecha:</strong>{" "}
                                            {p.fecha_creacion}
                                        </p>
                                        <p className="card-text">
                                            <strong>Estado:</strong>{" "}
                                            <span
                                                className={`badge bg-${p.estado === "entregado"
                                                    ? "success"
                                                    : p.estado === "listo"
                                                        ? "primary"
                                                        : p.estado ===
                                                            "en_preparacion"
                                                            ? "warning text-dark"
                                                            : "secondary"
                                                    }`}
                                            >
                                                {p.estado}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="card-footer d-flex justify-content-between">
                                        <button className="btn btn-sm btn-primary">
                                            Ver Detalle
                                        </button>
                                        {p.estado !== "entregado" && (
                                            <button className="btn btn-sm btn-success">
                                                Marcar Listo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No se encontraron pedidos</p>
                )}

                {/* Paginación */}
                {!loading && totalPaginas > 1 && (
                    <div className="pagination mt-4">
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
                )}
            </div>

            <FooterGeneral />

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default CocinaPedidos;

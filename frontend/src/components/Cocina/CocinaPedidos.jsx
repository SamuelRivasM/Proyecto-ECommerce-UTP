
// src/components/Cocina/CocinaPedidos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import "../Layout/modals.css";
import "./cocinaPedidos.css";

const CocinaPedidos = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [detallePedido, setDetallePedido] = useState([]);

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
            case "fecha_creacion":
                return p.fecha_creacion?.toLowerCase().includes(valor);
            default:
                return true;
        }
    });

    // Ver detalles
    const handleVerDetalle = async (pedido) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/pedidos/cliente/${pedido.id}/detalle`
            );
            setDetallePedido(res.data);
            setPedidoSeleccionado(pedido);
            setShowModal(true);
        } catch (err) {
            console.error("Error al obtener detalle:", err);
        }
    };

    const handleActualizarEstado = async (pedido) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/pedidos/${pedido.id}/actualizar-estado`,
                { estado: pedido.estado }
            );

            // Refrescar pedidos
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/pedidos/cocina/pedidos-ordenados`
            );
            setPedidos(response.data);
        } catch (err) {
            console.error("Error al actualizar estado:", err);
        }
    };

    const getEstadoClass = (estado) => {
        switch (estado?.toLowerCase()) {
            case "pendiente":
                return "badge bg-warning text-dark";
            case "en preparación":
                return "badge bg-info text-dark";
            case "listo":
                return "badge bg-primary";
            case "entregado":
                return "badge bg-success";
            default:
                return "badge bg-secondary";
        }
    };

    // === Función para capitalizar primera letra ===
    const capitalizarPrimeraLetra = (texto) => {
        if (!texto || texto.trim() === "") return "Desconocido";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };

    // === Alternar modo edición de estado ===
    const toggleEdicion = (pedidoId) => {
        setPedidos(pedidos.map(p =>
            p.id === pedidoId ? { ...p, editandoEstado: !p.editandoEstado } : p
        ));
    };

    // === Cerrar modal ===
    const handleCerrarModal = () => {
        setShowModal(false);
        setPedidoSeleccionado(null);
        setDetallePedido([]);
    };

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

            {/* === Contenido principal === */}
            <div className="container my-4">
                <h2 className="fw-bold text-center mb-4">Lista de Pedidos</h2>

                {/* === Filtro === */}
                <div
                    className="input-group mb-4 shadow-sm"
                    style={{ maxWidth: "650px", height: "50px", margin: "0 auto" }}
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
                        <option value="fecha_creacion">Fecha</option>
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

                {loading ? (
                    <p className="text-center">Cargando pedidos...</p>
                ) : pedidosPagina.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {pedidosPagina.map((p) => (
                            <div className="col" key={p.id}>
                                <div className={`card shadow-sm border-${p.estado === "entregado"
                                    ? "success"
                                    : p.estado === "listo"
                                        ? "primary"
                                        : p.estado === "en preparacion"
                                            ? "warning"
                                            : "secondary"
                                    }`}>
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">Pedido #{p.id}</h5>
                                        <p><strong>Cliente: </strong>{p.cliente_nombre}</p>
                                        <p><strong>Método de pago: </strong>{capitalizarPrimeraLetra(p.metodo_pago)}</p>
                                        <p><strong>Total:</strong> S/ {parseFloat(p.total).toFixed(2)}</p>
                                        <p><strong>Fecha entrega:</strong> {p.fecha_entrega || "—"}</p>
                                        <p><strong>Estado: </strong>
                                            {!p.editandoEstado ? (
                                                <span className={getEstadoClass(p.estado)}>
                                                    {capitalizarPrimeraLetra(p.estado)}
                                                </span>
                                            ) : (
                                                <select
                                                    value={p.estado}
                                                    onChange={(e) => {
                                                        p.estado = e.target.value;
                                                        setPedidos([...pedidos]);
                                                    }}
                                                    className="form-select form-select-sm mt-2"
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="en preparación">En preparación</option>
                                                    <option value="listo">Listo</option>
                                                    <option value="entregado">Entregado</option>
                                                </select>
                                            )}
                                        </p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleVerDetalle(p)}
                                        >
                                            Ver detalle
                                        </button>

                                        {!p.editandoEstado ? (
                                            <button
                                                className="btn btn-sm btn-dark"
                                                onClick={() => toggleEdicion(p.id)}
                                            >
                                                Actualizar estado
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => {
                                                    handleActualizarEstado(p);
                                                    toggleEdicion(p.id);
                                                }}
                                            >
                                                Guardar
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
                    <div className="pagination mt-4" style={{ margin: "50px" }}>
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

            {/* === Modal Detalle === */}
            {showModal && pedidoSeleccionado && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">
                                    Detalle del Pedido N° {pedidoSeleccionado.id}
                                </h5>
                            </div>
                            <div className="modal-body">

                                {/* === Información general del pedido === */}
                                <div className="mb-3">
                                    <p><strong>Fecha / Hora del Pedido:</strong> {pedidoSeleccionado.fecha_creacion}</p>
                                    <p><strong>Fecha / Hora de Entrega:</strong> {pedidoSeleccionado.fecha_entrega || "—"}</p>
                                    <p><strong>Estado:</strong>{" "}
                                        <span className={getEstadoClass(pedidoSeleccionado.estado)}>
                                            {capitalizarPrimeraLetra(pedidoSeleccionado.estado)}
                                        </span>
                                    </p>
                                    <p><strong>Método de Pago:</strong> {capitalizarPrimeraLetra(pedidoSeleccionado.metodo_pago)}</p>
                                    <p><strong>Total:</strong> S/ {pedidoSeleccionado.total}</p>
                                </div>

                                {/* === Tabla de productos === */}
                                <div className="table-container">
                                    <table className="table table-striped table-bordered align-middle">
                                        <thead>
                                            <tr>
                                                <th>Producto(s)</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario (S/)</th>
                                                <th>Subtotal (S/)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detallePedido.length > 0 ? (
                                                detallePedido.map((item) => (
                                                    <tr key={item.id}>
                                                        <td data-label="Producto(s):">{item.producto}</td>
                                                        <td data-label="Cantidad:">{item.cantidad}</td>
                                                        <td data-label="Precio Unitario (S/):">{item.precio}</td>
                                                        <td data-label="Subtotal (S/):">{item.subtotal}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No hay detalles disponibles.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCerrarModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Overlay del modal */}
            {showModal && <div className="modal-backdrop fade show"></div>}

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil Modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default CocinaPedidos;

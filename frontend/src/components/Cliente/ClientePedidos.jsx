
// src/components/Cliente/ClientePedidos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import Perfil from "../Layout/Perfil";
import "../Layout/modals.css";
import "./clientePedidos.css";

const ClientePedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");
    const [showPerfil, setShowPerfil] = useState(false);

    // Estado para modal de detalle
    const [showModal, setShowModal] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [detallePedido, setDetallePedido] = useState([]);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    // === Obtener pedidos del backend ===
    useEffect(() => {
        const cargarPedidos = () => {
            if (user?.id) {
                axios
                    .get(`${process.env.REACT_APP_API_URL}/pedidos/cliente/${user.id}`)
                    .then((res) => setPedidos(res.data))
                    .catch((err) => console.error("Error cargando pedidos:", err));
            }
        };

        cargarPedidos();

        // Escuchar evento de pedido creado para refrescar la tabla
        window.addEventListener("pedidoCreado", cargarPedidos);

        return () => window.removeEventListener("pedidoCreado", cargarPedidos);
    }, [user?.id]);

    useEffect(() => {
        document.body.classList.add("bootstrap-modal");
        return () => document.body.classList.remove("bootstrap-modal");
    }, []);

    // === Función para capitalizar primera letra ===
    const capitalizarPrimeraLetra = (texto) => {
        if (!texto || texto.trim() === "") return "Desconocido";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };

    // === Función para transformar estado de pago ===
    const getEstadoPagoText = (estado_pago, metodo_pago) => {
        // Solo mostrar estado de pago para billetera digital
        if (metodo_pago?.toLowerCase() === "billetera") {
            return estado_pago === 1 ? "Pagado" : "No pagado";
        }
        // Para otros métodos, mostrar vacío o N/A
        return "No pagado";
    };

    // === Etiqueta de color para estado de pago ===
    const getEstadoPagoClass = (estado_pago, metodo_pago) => {
        if (metodo_pago?.toLowerCase() !== "billetera") {
            return "badge bg-secondary";
        }
        return estado_pago === 1 ? "badge bg-success" : "badge bg-danger";
    };

    // === Filtrado ===
    const pedidosFiltrados = pedidos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "numero":
                return p.numero?.toString().includes(valor);
            case "cliente":
                return p.cliente_nombre?.toLowerCase().includes(valor);
            case "metodo_pago":
                return p.metodo_pago?.toLowerCase().includes(valor);
            case "estado":
                return p.estado?.toLowerCase().includes(valor);
            case "total":
                return p.total?.toString().includes(valor);
            case "estado_pago":
                const estadoTexto = p.estado_pago === 1 ? "pagado" : "no pagado";

                // Convertimos todo a minúsculas para igualdad
                const estadoLower = estadoTexto.toLowerCase();
                const valorLower = valor.toLowerCase();

                if (valorLower.startsWith("pa")) {
                    return p.estado_pago === 1; // Solo pagados
                }
                if (valorLower.startsWith("no")) {
                    return p.estado_pago === 0; // Solo no pagados
                }
                if (valorLower === "1") {
                    return p.estado_pago === 1;
                }
                if (valorLower === "0") {
                    return p.estado_pago === 0;
                }
                // Comparación exacta SOLO si coincide completamente
                return estadoLower === valorLower;
            case "fecha_creacion":
                return p.fecha_creacion?.toLowerCase().includes(valor);
            case "fecha_entrega":
                return p.fecha_entrega?.toLowerCase().includes(valor);
            default:
                return true;
        }
    });

    // === Etiqueta de color según estado ===
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

    // === Abrir modal de detalles ===
    const handleVerDetalle = async (pedido) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/pedidos/cliente/${pedido.id}/detalle`);
            setDetallePedido(res.data);
            setPedidoSeleccionado(pedido);
            setShowModal(true);
        } catch (error) {
            console.error("Error al obtener detalle del pedido:", error);
        }
    };

    // === Cerrar modal ===
    const handleCerrarModal = () => {
        setShowModal(false);
        setPedidoSeleccionado(null);
        setDetallePedido([]);
    };

    return (
        <div className="section-container">
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={() => window.location.replace("/")}
                onInicioClick={() => window.location.replace("/cliente-dashboard")}
                activePage="mis pedidos"
            />

            {/* === Contenido principal === */}
            <div className="container my-4">
                <h2 className="fw-bold text-center mb-4">Mis Pedidos</h2>

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
                        style={{ maxWidth: "200px", height: "50px" }}
                    >
                        <option value="todos">Todos</option>
                        <option value="numero">ID</option>
                        <option value="cliente">Cliente</option>
                        <option value="metodo_pago">Método de Pago</option>
                        <option value="estado">Estado del Pedido</option>
                        <option value="total">Total (S/)</option>
                        <option value="estado_pago">Estado de Pago</option>
                        <option value="fecha_creacion">Fecha de Creación</option>
                        <option value="fecha_entrega">Fecha de Entrega</option>
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

                {/* === Tabla === */}
                <div className="table-container">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-header">
                            <tr>
                                <th>N°</th>
                                <th>Método de Pago</th>
                                <th>Estado de Pedido</th>
                                <th>Estado de Pago</th>
                                <th>Total (S/)</th>
                                <th>Fecha / Hora del Pedido</th>
                                <th>Fecha / Hora de Entrega</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosFiltrados.length > 0 ? (
                                pedidosFiltrados.map((p) => (
                                    <tr key={p.numero}>
                                        <td data-label="N°:">{p.numero}</td>
                                        <td data-label="Método de Pago:">
                                            {capitalizarPrimeraLetra(p.metodo_pago)}
                                        </td>
                                        <td data-label="Estado de Pedido:">
                                            <span className={getEstadoClass(p.estado)}>
                                                {capitalizarPrimeraLetra(p.estado)}
                                            </span>
                                        </td>
                                        <td data-label="Estado de Pago:">
                                            <span className={getEstadoPagoClass(p.estado_pago, p.metodo_pago)}>
                                                {getEstadoPagoText(p.estado_pago, p.metodo_pago)}
                                            </span>
                                        </td>
                                        <td data-label="Total (S/):">{p.total}</td>
                                        <td data-label="Fecha / Hora del Pedido:">{p.fecha_creacion}</td>
                                        <td data-label="Fecha / Hora de Entrega:">{p.fecha_entrega || "—"}</td>
                                        <td data-label="Acciones:" className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-primary fw-bold"
                                                onClick={() => handleVerDetalle(p)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No se encontraron pedidos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === Modal Detalle === */}
            {showModal && pedidoSeleccionado && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title fw-bold">
                                    Detalle del Pedido N° {pedidoSeleccionado.numero}
                                </h5>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <p><strong>Fecha / Hora del Pedido:</strong> {pedidoSeleccionado.fecha_creacion}</p>
                                    <p><strong>Fecha / Hora de Entrega:</strong> {pedidoSeleccionado.fecha_entrega || "—"}</p>
                                    <p><strong>Estado:</strong>{" "}
                                        <span className={getEstadoClass(pedidoSeleccionado.estado)}>
                                            {capitalizarPrimeraLetra(pedidoSeleccionado.estado)}
                                        </span>
                                    </p>
                                    <p><strong>Método de Pago:</strong> {capitalizarPrimeraLetra(pedidoSeleccionado.metodo_pago)}</p>
                                    <p><strong>Estado de Pago:</strong>{" "}
                                        <span className={getEstadoPagoClass(pedidoSeleccionado.estado_pago, pedidoSeleccionado.metodo_pago)}>
                                            {getEstadoPagoText(pedidoSeleccionado.estado_pago, pedidoSeleccionado.metodo_pago)}
                                        </span>
                                    </p>
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

            {/* Chatbot de Landbot */}
            <LandbotChat />

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ClientePedidos;

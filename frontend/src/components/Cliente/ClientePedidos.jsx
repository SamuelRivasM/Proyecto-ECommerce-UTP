
// src/components/Cliente/ClientePedidos.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import Perfil from "../Layout/Perfil";
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
        if (user?.id) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/pedidos/cliente/${user.id}`)
                .then((res) => setPedidos(res.data))
                .catch((err) => console.error("Error cargando pedidos:", err));
        }
    }, [user?.id]);

    // === Función para capitalizar primera letra ===
    const capitalizarPrimeraLetra = (texto) => {
        if (!texto || texto.trim() === "") return "Desconocido";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };

    // === Filtrado ===
    const pedidosFiltrados = pedidos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "metodo_pago":
                return (p.metodo_pago || "desconocido").toLowerCase().includes(valor);
            case "estado":
                return (p.estado || "desconocido").toLowerCase().includes(valor);
            case "total":
                return p.total.toString().includes(valor);
            case "fecha":
                return p.fecha.toLowerCase().includes(valor);
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
                    style={{ maxWidth: "700px", height: "50px", margin: "0 auto" }}
                >
                    <span className="input-group-text bg-white border-end-0" style={{ height: "50px" }}>
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
                            backgroundColor: criterio === "todos" ? "#f5f5f5" : "white", height: "50px"
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
                                <th>Estado</th>
                                <th>Total (S/)</th>
                                <th>Fecha</th>
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
                                        <td data-label="Estado:">
                                            <span className={getEstadoClass(p.estado)}>
                                                {capitalizarPrimeraLetra(p.estado)}
                                            </span>
                                        </td>
                                        <td data-label="Total (S/):">{p.total}</td>
                                        <td data-label="Fecha:">{p.fecha}</td>
                                        <td data-label="Acción:" className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleVerDetalle(p)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
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
                                <h5 className="modal-title">
                                    Detalle del Pedido N° {pedidoSeleccionado.numero}
                                </h5>
                            </div>
                            <div className="modal-body">

                                {/* === Información general del pedido === */}
                                <div className="mb-3">
                                    <p><strong>Fecha:</strong> {pedidoSeleccionado.fecha}</p>
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

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ClientePedidos;

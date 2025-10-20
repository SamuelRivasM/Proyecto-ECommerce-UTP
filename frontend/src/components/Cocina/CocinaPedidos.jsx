// src/components/Cocina/CocinaPedidos.jsx
import { useState } from "react";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import "./cocinaPedidos.css";

const CocinaPedidos = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");

    // Pedidos simulados
    const pedidos = Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        cliente: `Cliente ${i + 1}`,
        metodo_pago: ["efectivo", "tarjeta", "billetera"][i % 3],
        estado: ["pendiente", "en preparación", "listo", "entregado"][i % 4],
        total: (Math.random() * 30 + 10).toFixed(2),
        fecha: "2025-10-19 12:30:00",
    }));

    // Filtrado
    const pedidosFiltrados = pedidos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "id":
                return p.id.toString() === valor;
            case "cliente":
                return p.cliente.toLowerCase().includes(valor);
            case "metodo_pago":
                return p.metodo_pago.toLowerCase().includes(valor);
            case "estado":
                return p.estado.toLowerCase().includes(valor);
            case "total":
                return p.total.toString().includes(valor);
            case "fecha":
                return p.fecha.toLowerCase().includes(valor);
            default:
                return true;
        }
    });

    // Paginación
    const itemsPorPagina = 15;
    const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);
    const inicio = (currentPage - 1) * itemsPorPagina;
    const pedidosPagina = pedidosFiltrados.slice(inicio, inicio + itemsPorPagina);

    return (
        <div className="section-container">
            {/* Navbar General */}
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
                        <option value="cliente">Cliente</option>
                        <option value="metodo_pago">Método de Pago</option>
                        <option value="estado">Estado</option>
                        <option value="total">Total (S/)</option>
                        <option value="fecha">Fecha</option>
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
                                <th>Cliente</th>
                                <th>Método de Pago</th>
                                <th>Estado</th>
                                <th>Total (S/)</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosPagina.length > 0 ? (
                                pedidosPagina.map((p) => (
                                    <tr key={p.id}>
                                        <td data-label="ID:">{p.id}</td>
                                        <td data-label="Cliente:">{p.cliente}</td>
                                        <td data-label="Método de Pago:">{p.metodo_pago}</td>
                                        <td data-label="Estado:">{p.estado}</td>
                                        <td data-label="Total (S/):">{p.total}</td>
                                        <td data-label="Fecha:">{p.fecha}</td>
                                        <td data-label="Acciones:" className="action-buttons">
                                            <button className="btn btn-sm btn-primary">Ver Detalle</button>
                                            <button className="btn btn-sm btn-success">Marcar Listo</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
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

export default CocinaPedidos;

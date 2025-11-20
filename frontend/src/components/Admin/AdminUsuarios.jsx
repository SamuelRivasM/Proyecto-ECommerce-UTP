
// src/components/Admin/AdminUsuarios.jsx
import { useState } from "react";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import Perfil from "../Layout/Perfil";

const AdminUsuarios = () => {
    const [showPerfil, setShowPerfil] = useState(false);

    // Datos simulados estáticos
    const [usuarios] = useState([
        {
            id: 1,
            nombre: "Sergio",
            email: "sergio@utp.edu.pe",
            telefono: "987654321",
            rol: "admin",
            fecha_registro: "2024-10-10",
            ultimo_login: "2025-10-19 09:30",
            estado: 1,
        },
        {
            id: 2,
            nombre: "Rodri",
            email: "rodri@utp.edu.pe",
            telefono: "999888777",
            rol: "cocina",
            fecha_registro: "2024-11-05",
            ultimo_login: "2025-10-18 22:45",
            estado: 0,
        },
        {
            id: 3,
            nombre: "Aaron",
            email: "aaron@utp.edu.pe",
            telefono: "912345678",
            rol: "cliente",
            fecha_registro: "2025-01-10",
            ultimo_login: "2025-10-17 17:15",
            estado: 1,
        },
        {
            id: 4,
            nombre: "Samuel",
            email: "samuel@utp.edu.pe",
            telefono: "964234812",
            rol: "cliente",
            fecha_registro: "2025-01-10",
            ultimo_login: "2025-10-17 17:15",
            estado: 1,
        },
    ]);

    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");

    // Lógica de filtrado
    const usuariosFiltrados = usuarios.filter((u) => {
        if (criterio === "todos") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "id":
                return u.id.toString() === valor;
            case "nombre":
                return u.nombre.toLowerCase().includes(valor);
            case "email":
                return u.email.toLowerCase().includes(valor);
            case "telefono":
                return u.telefono.includes(valor);
            case "rol":
                return u.rol.toLowerCase().includes(valor);
            default:
                return true;
        }
    });

    return (
        <div
            style={{
                backgroundColor: "#FAF7F5",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onInicioClick={() => (window.location.href = "/admin-dashboard")}
                onLogout={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
                activePage="usuarios"
            />

            {/* === Contenido principal === */}
            <main className="container py-5 flex-grow-1">
                {/* Título y botón al mismo nivel */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold m-0">Gestión de Usuarios</h2>
                    <button className="btn btn-primary">➕ Nuevo Usuario</button>
                </div>

                {/* Barra de búsqueda con combo */}
                <div className="input-group mb-4 shadow-sm" style={{ maxWidth: "600px", height: "50px" }}>
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
                        style={{ maxWidth: "140px", height: "50px" }}
                    >
                        <option value="todos">Todos</option>
                        <option value="id">ID</option>
                        <option value="nombre">Nombre</option>
                        <option value="email">Correo</option>
                        <option value="telefono">Teléfono</option>
                        <option value="rol">Rol</option>
                    </select>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder={criterio === "todos" ? "Mostrar todos" : `Buscar por ${criterio}...`}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        disabled={criterio === "todos"}
                        style={{ height: "50px", backgroundColor: criterio === "todos" ? "#f5f5f5" : "white" }}
                    />
                </div>

                {/* Tabla de usuarios */}
                <div className="table-responsive">
                    <table className="table table-striped align-middle shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Fecha Registro</th>
                                <th>Último Login</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length > 0 ? (
                                usuariosFiltrados.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.nombre}</td>
                                        <td>{u.email}</td>
                                        <td>{u.telefono}</td>
                                        <td className="text-capitalize">{u.rol}</td>
                                        <td>{u.fecha_registro}</td>
                                        <td>{u.ultimo_login}</td>
                                        <td>
                                            <span
                                                className={`badge ${u.estado ? "bg-success" : "bg-secondary"}`}
                                            >
                                                {u.estado ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-2">
                                                Editar
                                            </button>
                                            <button
                                                className={`btn btn-sm ${u.estado ? "btn-danger" : "btn-success"}`}
                                            >
                                                {u.estado ? "Desactivar" : "Activar"}
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
                </div>
            </main>

            {/* Chatbot de Landbot */}
            <LandbotChat />

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default AdminUsuarios;

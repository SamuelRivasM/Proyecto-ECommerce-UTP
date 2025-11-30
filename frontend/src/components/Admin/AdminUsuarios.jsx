// src/components/Admin/AdminUsuarios.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import Perfil from "../Layout/Perfil";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminUsuarios = () => {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [showPerfil, setShowPerfil] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nombre: "",
        email: "",
        telefono: "",
        rol: "cliente",
        password: ""
    });
    const [mensaje, setMensaje] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const cargarUsuarios = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/cargar-usuarios`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error cargando usuarios:", err);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
        cargarUsuarios();
    }, [token, navigate, cargarUsuarios]);

    // Cambios en inputs del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Enviar formulario (crear o editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!formData.nombre || !formData.email || !formData.rol || (!modoEdicion && !formData.password)) {
            setMensaje("Complete los campos obligatorios");
            return;
        }

        try {
            if (modoEdicion) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/admin/editar-usuario/${formData.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMensaje("Usuario actualizado con éxito");
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/admin/crear-usuario`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMensaje("Usuario creado correctamente");
            }

            setFormData({ id: null, nombre: "", email: "", telefono: "", rol: "cliente", password: "" });
            setModoEdicion(false);
            cargarUsuarios();

        } catch (error) {
            console.error("Error al guardar:", error);

            const msg = error.response?.data?.message;
            if (msg === "El teléfono ya está registrado") {
                toast.error("El teléfono ya está registrado por otro usuario");
            }
            else if (msg === "El correo ya está registrado") {
                toast.error("El correo ya está registrado");
            }
            else {
                toast.error("Ocurrió un error al guardar el usuario");
            }
        }

    };

    const editarUsuario = (u) => {
        setFormData({
            id: u.id,
            nombre: u.nombre || "",
            email: u.email || "",
            telefono: u.telefono || "",
            rol: u.rol || "cliente",
            password: ""
        });
        setModoEdicion(true);
        window.scrollTo(0, 0);
    };


    const cambiarEstado = async (u) => {
        try {
            const nuevoEstado = u.estado ? 0 : 1;
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/admin/estado-usuario/${u.id}`,
                { estado: nuevoEstado },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            cargarUsuarios();
        } catch (error) {
            console.error("Error cambiar estado:", error);
        }
    };

    const usuariosFiltrados = usuarios.filter((u) => {
        if (criterio === "todos") return true;
        const valor = filtro.toLowerCase();
        return u[criterio]?.toString().toLowerCase().includes(valor);
    });

    return (
        <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onInicioClick={() => (window.location.href = "/admin-dashboard")}
                onLogout={() => { localStorage.clear(); window.location.href = "/"; }}
                activePage="usuarios"
            />

            <main className="container py-5 flex-grow-1">

                {/* Formulario */}
                <div className="card shadow p-4 mb-4">
                    <h4 className="fw-bold mb-3">
                        {modoEdicion ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
                    </h4>

                    {mensaje && <div className="alert alert-info py-2">{mensaje}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">

                            <div className="col-md-4">
                                <label className="form-label fw-bold">Nombre *</label>
                                <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-bold">Correo *</label>
                                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-bold">Teléfono</label>
                                <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-bold">
                                    Contraseña {modoEdicion ? "(opcional)" : "*"}
                                </label>

                                <div className="input-group">
                                    <input
                                        type={mostrarPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={modoEdicion ? "Dejar en blanco si no cambia" : ""}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                                        style={{ height: "38px" }}
                                        onClick={() => setMostrarPassword(!mostrarPassword)}
                                    >
                                        {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>

                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-bold">Rol *</label>
                                <select name="rol" className="form-select" value={formData.rol} onChange={handleChange}>
                                    <option value="admin">Administrador</option>
                                    <option value="cliente">Cliente</option>
                                    <option value="cocina">Cocina</option>
                                </select>
                            </div>

                            <div className="col-12 d-flex gap-2 mt-2">
                                <button className="btn btn-primary" type="submit">
                                    {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
                                </button>

                                {modoEdicion && (
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => {
                                            setModoEdicion(false);
                                            setFormData({ id: null, nombre: "", email: "", telefono: "", rol: "cliente", password: "" });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                {/* Barra de búsqueda */}
                <div
                    className="input-group mb-4 shadow-sm"
                    style={{ maxWidth: "600px", height: "50px" }}
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
                            backgroundColor: criterio === "todos" ? "#f5f5f5" : "white",
                        }}
                    />
                </div>

                {/* Tabla */}
                <div className="table-responsive">
                    <table className="table table-striped align-middle shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th><th>Nombre</th><th>Email</th>
                                <th>Teléfono</th><th>Rol</th>
                                <th>Fecha Registro</th><th>Último Login</th>
                                <th>Estado</th><th>Acciones</th>
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
                                        <td>{u.ultimo_login || "—"}</td>
                                        <td>
                                            <span className={`badge ${u.estado ? "bg-success" : "bg-secondary"}`}>
                                                {u.estado ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => editarUsuario(u)}>
                                                Editar
                                            </button>
                                            <button
                                                className={`btn btn-sm ${u.estado ? "btn-danger" : "btn-success"}`}
                                                onClick={() => cambiarEstado(u)}
                                            >
                                                {u.estado ? "Desactivar" : "Activar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="9" className="text-center">No hay usuarios</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </main>

            <LandbotChat />
            <FooterGeneral />

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default AdminUsuarios;

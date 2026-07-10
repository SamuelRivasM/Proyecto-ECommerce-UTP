// src/components/Admin/AdminUsuarios.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import Perfil from "../Layout/Perfil";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminUsuarios.css";
import useGlobalLogout from "../../hooks/useGlobalLogout";

const AdminUsuarios = () => {
    const navigate = useNavigate();
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

    // Estados para el modal de confirmación
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmData, setConfirmData] = useState(null);

    const token = localStorage.getItem("token");

    // Obtener datos del usuario logueado
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = userData.id;
    const currentUserRol = userData.rol;

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

    // Función que realiza el submit real (crear o editar)
    const realizarSubmit = async (data) => {
        const { debeLogout, formData: dataForm, modoEdicion: editMode } = data;

        try {
            if (editMode) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/admin/editar-usuario/${dataForm.id}`,
                    dataForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMensaje("Usuario actualizado con éxito");
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/admin/crear-usuario`,
                    dataForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMensaje("Usuario creado correctamente");
            }

            // Limpiar formulario y recargar lista
            setFormData({ id: null, nombre: "", email: "", telefono: "", rol: "cliente", password: "" });
            setModoEdicion(false);
            await cargarUsuarios();

            // Si cambió su propio rol, forzar logout
            if (debeLogout) {
                toast.info("Cambio de rol aplicado. Cerrando sesión...");
                setTimeout(() => handleLogout(), 500);
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            const msg = error.response?.data?.message;
            if (msg === "El teléfono ya está registrado") {
                toast.error("El teléfono ya está registrado por otro usuario");
            } else if (msg === "El correo ya está registrado") {
                toast.error("El correo ya está registrado");
            } else {
                toast.error("Ocurrió un error al guardar el usuario");
            }
        }
    };

    // Enviar formulario (crear o editar)
    const handleSubmit = (e) => {
        e.preventDefault();
        setMensaje("");

        if (!formData.nombre || !formData.email || !formData.rol || (!modoEdicion && !formData.password)) {
            setMensaje("Complete los campos obligatorios");
            return;
        }

        // --- VALIDACIÓN DE ROL PROPIO ---
        if (modoEdicion && formData.id === currentUserId && formData.rol !== currentUserRol) {
            // Abrir el modal de confirmación en lugar de window.confirm
            setConfirmData({
                debeLogout: true,
                formData: { ...formData },
                modoEdicion: true
            });
            setShowConfirmModal(true);
            return;
        }

        // Si no aplica la condición, ejecutar directamente
        realizarSubmit({
            debeLogout: false,
            formData: { ...formData },
            modoEdicion
        });
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

    const handleLogout = useGlobalLogout();

    return (
        <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={handleLogout}
                onInicioClick={() => navigate("/admin-dashboard")}
                activePage="usuarios"
            />

            {/* === Contenido principal === */}
            <main className="container py-5 flex-grow-1">
                <h1 className="sr-only">Gestión de Usuarios - UTP Coffee Point (Admin)</h1>

                {/* Formulario */}
                <div className="card shadow p-4 mb-4">
                    <h4 className="fw-bold mb-3">
                        {modoEdicion ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
                    </h4>

                    {mensaje && <div className="alert alert-info py-2">{mensaje}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">

                            <div className="col-md-4">
                                <label htmlFor="admin-usuario-nombre" className="form-label fw-bold">Nombre *</label>
                                <input id="admin-usuario-nombre" type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="admin-usuario-email" className="form-label fw-bold">Correo *</label>
                                <input id="admin-usuario-email" type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="admin-usuario-telefono" className="form-label fw-bold">Teléfono</label>
                                <input id="admin-usuario-telefono" type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="admin-usuario-password" className="form-label fw-bold">
                                    Contraseña {modoEdicion ? "(opcional)" : "*"}
                                </label>

                                <div className="input-group">
                                    <input
                                        id="admin-usuario-password"
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
                                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {mostrarPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="admin-usuario-rol" className="form-label fw-bold">Rol *</label>
                                <select id="admin-usuario-rol" name="rol" className="form-select" value={formData.rol} onChange={handleChange}>
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
                        aria-hidden="true"
                    >
                        🔍
                    </span>

                    <label htmlFor="admin-usuarios-criterio" className="sr-only">Filtrar usuarios por</label>
                    <select
                        id="admin-usuarios-criterio"
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

                    <label htmlFor="admin-usuarios-valor" className="sr-only">
                        {criterio === "todos" ? "Mostrar todos los usuarios" : `Buscar por ${criterio}`}
                    </label>
                    <input
                        id="admin-usuarios-valor"
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
                                        <td data-label="ID:">{u.id}</td>
                                        <td data-label="Nombre:">{u.nombre}</td>
                                        <td data-label="Email:">{u.email}</td>
                                        <td data-label="Teléfono:">{u.telefono}</td>
                                        <td className="text-capitalize" data-label="Rol:">
                                            {u.rol}
                                        </td>
                                        <td data-label="Fecha de Registro:">{u.fecha_registro}</td>
                                        <td data-label="Último Login:">{u.ultimo_login || "—"}</td>
                                        <td data-label="Estado:">
                                            <span className={`badge ${u.estado ? "bg-success" : "bg-secondary"}`}>
                                                {u.estado ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td data-label="Acciones:">
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

                <br />
                <br />
            </main>

            <LandbotChat />
            <FooterGeneral />

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}

            {/* Modal de confirmación personalizado */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4 className="modal-title">⚠️ Advertencia importante</h4>
                        <div className="modal-body">
                            <p>
                                Estás cambiando <strong>tu propio rol</strong> de <span className="badge bg-secondary">{currentUserRol}</span> a <span className="badge bg-primary">{formData.rol}</span>.
                            </p>
                            <p className="text-danger fw-bold">
                                Perderás acceso de administrador y tu sesión se cerrará automáticamente.
                            </p>
                            <p className="mb-0">¿Estás seguro de continuar?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    if (confirmData) {
                                        realizarSubmit(confirmData);
                                    }
                                }}
                            >
                                Sí, continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsuarios;

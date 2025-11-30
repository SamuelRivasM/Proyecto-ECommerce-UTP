
// src/components/Layout/Perfil.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const Perfil = ({ onClose }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [showPassword, setShowPassword] = useState(false);

    const [usuario, setUsuario] = useState(null);
    const [editable, setEditable] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        rol: "",
        fecha_registro: "",
        password: "",
    });

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        const fetchPerfil = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/perfil`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsuario(res.data);
                setFormData({
                    nombre: res.data.nombre,
                    email: res.data.email,
                    telefono: res.data.telefono || "",
                    rol: res.data.rol,
                    fecha_registro: res.data.fecha_registro,
                    password: "",
                });
            } catch (err) {
                console.error("Error cargando perfil", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            }
        };

        fetchPerfil();
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/perfil`,
                {
                    nombre: formData.nombre,
                    telefono: formData.telefono,
                    password: formData.password, // opcional, si está vacío no cambia
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setEditable(false);
            setFormData({ ...formData, password: "" }); // limpiar password
            toast.success("Perfil actualizado correctamente");
        } catch (err) {
            console.error("Error actualizando perfil", err);
            toast.error("Error al actualizar perfil");
        }
    };

    if (!usuario) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            overflowY: "auto",
        }}>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#A4001D" }}>
                <div className="container">
                    <button
                        type="button"
                        className="navbar-brand fw-bold btn btn-link text-white text-decoration-none"
                        style={{ cursor: "default" }}
                    >
                        UTP COFFEE POINT - Perfil
                    </button>

                    <div className="ms-auto d-flex align-items-center">
                        <FaUserCircle size={28} className="text-white me-3" />
                        <button
                            className="btn btn-danger"
                            onClick={onClose}
                        >
                            ✖
                        </button>
                    </div>
                </div>
            </nav>
            {/* Contenido */}
            <main className="container my-5">

                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="fw-bold mb-4"> Mi Perfil</h2>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="text"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={!editable}
                            />
                        </div>

                        <div className="mb-3 position-relative">
                            <label className="form-label">Contraseña</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={!editable}
                                placeholder="•••••• (dejar en blanco para no cambiar)"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    top: "75%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d",
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Rol</label>
                            <input type="text" className="form-control" value={formData.rol} disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha de Registro</label>
                            <input
                                type="text"
                                className="form-control"
                                value={new Date(formData.fecha_registro).toLocaleDateString("es-PE")}
                                disabled
                            />
                        </div>

                        {!editable ? (
                            <button className="btn btn-warning" onClick={() => setEditable(true)}>
                                Editar
                            </button>
                        ) : (
                            <button className="btn btn-success" onClick={handleSave}>
                                Guardar
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Perfil;

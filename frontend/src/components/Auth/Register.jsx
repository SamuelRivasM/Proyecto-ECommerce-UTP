
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Auth.css";
import bgCafe from "../../assets/img/bg-cafe.jpg";
import cafeImg from "../../assets/img/cafeteria-utp.jpeg";

const Register = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 🔹 Validación del teléfono en frontend
        const telefonoRegex = /^\+51\d{9}$/;
        if (!telefonoRegex.test(telefono)) {
            toast.error("El teléfono debe estar en formato +51 seguido de 9 dígitos");
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                nombre,
                email,
                telefono,
                password,
            });

            toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            const msg = error.response?.data?.message || "Error en el registro";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="auth-container"
            style={{
                backgroundImage: `linear-gradient(rgba(52, 52, 52, 0.5), rgba(52, 52, 52, 0.5)), url(${bgCafe})`,
            }}
        >
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="auth-card login-card">
                {/* Panel izquierdo */}
                <div className="auth-left">
                    <img src={cafeImg} alt="Cafetería UTP" className="auth-image" />
                    <div className="auth-overlay">
                        <h2 className="auth-title">UTP Coffee Point</h2>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="auth-right">
                    <div className="auth-overlay-mobile">
                        <h2 className="auth-title-mobile">UTP Coffee Point</h2>
                    </div>

                    <h2 className="auth-heading">¡Regístrate!</h2>
                    <form onSubmit={handleRegister}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />

                        <label>Correo UTP:</label>
                        <input
                            type="email"
                            placeholder="correo@utp.edu.pe"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Teléfono:</label>
                        <input
                            type="text"
                            placeholder="+51999888777"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />

                        <label>Contraseña:</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Procesando..." : "Registrarse"}
                        </button>
                    </form>

                    <div className="auth-links">
                        <p>
                            ¿Ya tienes cuenta? <Link to="/">Iniciar Sesión</Link>
                        </p>
                        <p>
                            <Link to="/forgot-password">¿Has olvidado tu contraseña?</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

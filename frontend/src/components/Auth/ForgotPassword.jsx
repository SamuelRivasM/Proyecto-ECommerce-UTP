
// src/components/Auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Auth.css";
import bgCafe from "../../assets/img/bg-cafe.jpg";

const ForgotPassword = () => {
    const [method, setMethod] = useState("email");
    const [value, setValue] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
                { method, value }
            );
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al enviar solicitud");
        }
    };

    return (
        <div
            className="auth-container"
            style={{
                backgroundImage: `linear-gradient(rgba(52,52,52,0.5), rgba(52,52,52,0.5)), url(${bgCafe})`,
            }}
        >
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="auth-card">
                <h2 className="auth-heading">Recuperar contraseña</h2>

                <form onSubmit={handleSubmit}>
                    <label>Método de recuperación:</label>
                    <div className="auth-select-wrapper">
                        <select
                            className="auth-select"
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                        >
                            <option value="email">Correo electrónico</option>
                            <option value="telefono" disabled>Teléfono</option>
                        </select>
                    </div>

                    <label>
                        {method === "email" ? "Correo UTP:" : "Teléfono registrado:"}
                    </label>
                    <input
                        type={method === "email" ? "email" : "text"}
                        placeholder={method === "email" ? "correo@utp.edu.pe" : "987654321"}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                    />

                    <button type="submit" className="auth-btn">
                        Enviar {method === "email" ? "correo" : "SMS"}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        ¿Ya tienes cuenta? <Link to="/">Iniciar Sesión</Link>
                    </p>
                    <p>
                        ¿Aún no tienes cuenta? <Link to="/register">Crear cuenta</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

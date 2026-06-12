
// src/components/Auth/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./Auth.css";
import bgCafe from "../../assets/img/bg-cafe.jpg";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getPasswordStrength = (value) => {
        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        if (!value) {
            return {
                label: "",
                className: "",
                level: 0,
            };
        }

        if (score <= 2) {
            return {
                label: "Débil",
                className: "weak",
                level: 1,
            };
        }

        if (score <= 4) {
            return {
                label: "Moderada",
                className: "moderate",
                level: 2,
            };
        }

        return {
            label: "Fuerte",
            className: "strong",
            level: 3,
        };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (passwordStrength.level === 1) {
            toast.error("La contraseña es débil. Usa mínimo 8 caracteres, mayúsculas, números o símbolos.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/reset-password`,
                { token, newPassword }
            );

            toast.success(response.data.message);
            setTimeout(() => navigate("/"), 3000);
        } catch (error) {
            const msg = error.response?.data?.message || "Error al restablecer contraseña";
            toast.error(msg);
        } finally {
            setLoading(false);
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
                <h2 className="auth-heading">Restablecer contraseña</h2>

                <form onSubmit={handleReset}>
                    <label>Nueva contraseña:</label>
                    <div className="password-container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="********"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {newPassword && (
                        <div className="password-strength">
                            <div className="password-strength-header">
                                <span>Seguridad:</span>
                                <span className={`password-strength-text ${passwordStrength.className}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>

                            <div className="password-strength-bar">
                                <div className={`password-strength-fill ${passwordStrength.className}`}></div>
                            </div>

                            <small className="password-requirements">
                                Usa mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos.
                            </small>
                        </div>
                    )}

                    <label>Confirmar contraseña:</label>
                    <div className="password-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {confirmPassword && newPassword !== confirmPassword && (
                        <small className="confirm-password-error">
                            Las contraseñas no coinciden.
                        </small>
                    )}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Procesando..." : "Cambiar contraseña"}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        <Link to="/">Volver al Inicio de Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

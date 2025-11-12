
// src/components/Auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./Auth.css";
import bgCafe from "../../assets/img/bg-cafe.jpg";
import cafeImg from "../../assets/img/cafeteria-utp.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Bienvenido ${user.nombre}`);

      switch (user.rol) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "cliente":
          navigate("/cliente-dashboard");
          break;
        case "cocina":
          navigate("/cocina-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Error en inicio de sesión";
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
      <div className="auth-card login-card">
        <div className="auth-left">
          <img src={cafeImg} alt="Cafetería UTP" className="auth-image" />
          <div className="auth-overlay">
            <h2 className="auth-title">UTP Coffee Point</h2>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-overlay-mobile">
            <h2 className="auth-title-mobile">UTP Coffee Point</h2>
          </div>

          <h2 className="auth-heading">¡Bienvenido!</h2>
          <form onSubmit={handleLogin}>
            <label>Ingresa tu Correo UTP:</label>
            <input
              type="email"
              placeholder="correo@utp.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Ingresa tu Contraseña:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Procesando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              ¿Aún no tienes cuenta? <Link to="/register">Crear cuenta</Link>
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

export default Login;

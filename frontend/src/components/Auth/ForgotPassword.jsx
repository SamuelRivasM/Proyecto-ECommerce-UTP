
import { Link } from "react-router-dom";
import "./Auth.css";
import bgCafe from "../../assets/img/bg-cafe.jpg";

const ForgotPassword = () => {
    return (
        <div className="auth-container"
            style={{
                backgroundImage: `linear-gradient(rgba(52, 52, 52, 0.5), rgba(52, 52, 52, 0.5)), url(${bgCafe})`
            }}>
            <div className="auth-card">
                <h2 className="auth-heading">Cambiar contraseña</h2>

                <form>
                    <label>Correo UTP:</label>
                    <input type="email" placeholder="correo@utp.edu.pe" required />

                    <button type="submit" className="auth-btn">
                        Enviar correo
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

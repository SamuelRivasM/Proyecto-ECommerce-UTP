
import { Link } from "react-router-dom";
import "./Auth.css";
import bgCafe from "../../assets/img/bg-cafe.jpg";
import cafeImg from "../../assets/img/cafeteria-utp.jpeg";

const Register = () => {
    return (
        <div className="auth-container"
            style={{
                backgroundImage: `linear-gradient(rgba(52, 52, 52, 0.5), rgba(52, 52, 52, 0.5)), url(${bgCafe})`
            }}>
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

                    {/* Solo en móvil */}
                    <div className="auth-overlay-mobile">
                        <h2 className="auth-title-mobile">UTP Coffee Point</h2>
                    </div>

                    <h2 className="auth-heading">¡Regístrate!</h2>
                    <form>
                        <label>Nombre:</label>
                        <input type="text" placeholder="Tu nombre" required />

                        <label>Correo UTP:</label>
                        <input type="email" placeholder="correo@utp.edu.pe" required />

                        <label>Contraseña:</label>
                        <input type="password" placeholder="********" required />

                        <button type="submit" className="auth-btn">
                            Registrarse
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

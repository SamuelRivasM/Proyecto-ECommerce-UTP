
// src/components/Dashboard/ClienteDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiMapPin } from "react-icons/fi";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";

// Imágenes
import cafeteriaEntrada from "../../assets/img/cafeteria-entrada.jpeg";
import cafeteriaInterior from "../../assets/img/cafeteria-interior.jpeg";
import cafeteriaComida from "../../assets/img/cafeteria-comida.jpeg";
import cafeteriaMesa from "../../assets/img/cafeteria-mesa.jpeg";

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const [showPerfil, setShowPerfil] = useState(false);

  useEffect(() => {
    const myCarousel = document.querySelector("#heroCarousel");
    if (myCarousel) {
      new window.bootstrap.Carousel(myCarousel, {
        interval: 5000,
        ride: "carousel",
        pause: false,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar General */}
      <NavbarGeneral
        onPerfilClick={() => setShowPerfil(true)}
        onLogout={handleLogout}
        onInicioClick={() => navigate("/cliente-dashboard")}
        activePage="inicio"
      />

      {/* === Contenido principal === */}
      {/* Hero Section con carrusel */}
      <div id="heroCarousel" className="carousel slide carousel-fade flex-grow">
        <div className="carousel-inner" style={{ height: "90vh" }}>
          {[cafeteriaEntrada, cafeteriaInterior, cafeteriaComida, cafeteriaMesa].map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img src={img} className="d-block w-100" alt={`Cafetería ${i}`} style={{ objectFit: "cover", height: "90vh" }} />
            </div>
          ))}
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1 }}></div>

          <div className="position-absolute top-50 start-50 translate-middle text-center text-white px-4" style={{ maxWidth: "800px", zIndex: 2 }}>
            <h2 className="fw-bold mb-3">¿UN ANTOJO?</h2>
            <p className="mb-4">
              La cafetería de la Universidad Tecnológica del Perú (UTP) en Lima Sur busca mejorar la experiencia de sus estudiantes,
              docentes y personal administrativo con pedidos en línea y pagos rápidos.
            </p>
            <div className="mb-4">
              <button className="btn btn-danger me-3">Reservar</button>
              <button className="btn btn-danger" onClick={() => navigate("/cliente-productos")}>
                Ver menú
              </button>
            </div>

            <div className="d-flex justify-content-center gap-5">
              <div>
                <p className="fw-semibold mb-1 d-flex align-items-center justify-content-center gap-2">
                  <FiClock size={18} /> Atención
                </p>
                <p className="mb-0">8:30 am - 20:30 pm</p>
              </div>
              <div>
                <p className="fw-semibold mb-1 d-flex align-items-center justify-content-center gap-2">
                  <FiMapPin size={18} /> Ubicación
                </p>
                <p className="mb-0">1er piso torre C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot de Landbot */}
      <LandbotChat /> 

      {/* Footer */}
      <FooterGeneral />

      {/* Perfil modal */}
      {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
    </div>
  );
};

export default ClienteDashboard;

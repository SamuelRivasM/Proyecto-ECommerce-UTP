
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import ContactoSection from "../Layout/ContactoSection";

// Imágenes (mantenemos las mismas que cliente)
import cafeteriaEntrada from "../../assets/img/cafeteria-entrada.jpeg";
import cafeteriaInterior from "../../assets/img/cafeteria-interior.jpeg";
import cafeteriaComida from "../../assets/img/cafeteria-comida.jpeg";
import cafeteriaMesa from "../../assets/img/cafeteria-mesa.jpeg";

const CocinaDashboard = () => {
  const navigate = useNavigate();
  const [showPerfil, setShowPerfil] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    // Inicializar el carrusel manualmente
    const myCarousel = document.querySelector("#heroCarousel");
    if (myCarousel) {
      new window.bootstrap.Carousel(myCarousel, {
        interval: 5000, // 5 seg por imagen
        ride: "carousel",
        pause: false, // no detener con hover
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // redirige al login
  };

  return (
    <div
      style={{
        backgroundColor: "#FAF7F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar General */}
      <NavbarGeneral
        onPerfilClick={() => setShowPerfil(true)}
        onLogout={handleLogout}
        onInicioClick={() => navigate("/cliente-dashboard")}
        activePage="inicio"
      />

      {/* === Contenido principal === */}
      {/* Hero Section con carrusel */}
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade flex-grow"
      >
        <div className="carousel-inner" style={{ height: "90vh" }}>
          <div className="carousel-item active">
            <img
              src={cafeteriaEntrada}
              className="d-block w-100"
              alt="Cafetería Entrada"
              style={{ objectFit: "cover", height: "90vh" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src={cafeteriaInterior}
              className="d-block w-100"
              alt="Cafetería Interior"
              style={{ objectFit: "cover", height: "90vh" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src={cafeteriaComida}
              className="d-block w-100"
              alt="Comida Cafetería"
              style={{ objectFit: "cover", height: "90vh" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src={cafeteriaMesa}
              className="d-block w-100"
              alt="Mesa Cafetería"
              style={{ objectFit: "cover", height: "90vh" }}
            />
          </div>

          {/* Overlay oscuro */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1,
            }}
          ></div>

          {/* Texto sobre el overlay */}
          <div
            className="position-absolute top-50 start-50 translate-middle text-center text-white px-4"
            style={{ maxWidth: "800px", zIndex: 2 }}
          >
            <h2 className="fw-bold mb-3">Panel de Cocina</h2>
            <p className="mb-4">
              Administra pedidos en tiempo real y gestiona los productos de la
              cafetería UTP Lima Sur para optimizar la atención a clientes.
            </p>
            <div className="mb-4">
              <button className="btn btn-danger me-3">Ver Pedidos</button>
              <button className="btn btn-danger">Gestionar Productos</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white mt-auto py-3" style={{ backgroundColor: "#A4001D" }}>
        <div className="container text-center">
          <p className="mb-1">&copy; {new Date().getFullYear()} Universidad Tecnológica del Perú - Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Perfil modal */}
      {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
    </div>
  );
};

export default CocinaDashboard;

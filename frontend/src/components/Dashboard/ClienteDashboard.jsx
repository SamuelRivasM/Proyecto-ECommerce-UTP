
import { useEffect } from "react";
import { FiClock, FiMapPin } from "react-icons/fi";

// Imágenes
import cafeteriaEntrada from "../../assets/img/cafeteria-entrada.jpeg";
import cafeteriaInterior from "../../assets/img/cafeteria-interior.jpeg";
import cafeteriaComida from "../../assets/img/cafeteria-comida.jpeg";
import cafeteriaMesa from "../../assets/img/cafeteria-mesa.jpeg";

const ClienteDashboard = () => {
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

  return (
    <div
      style={{
        backgroundColor: "#FAF7F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#A4001D" }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            UTP COFFEE POINT
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link active" href="#">Inicio</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Productos</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Mis Pedidos</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Carrito</a></li>
              <li className="nav-item ms-3"><span className="nav-link">👤</span></li>
            </ul>
          </div>
        </div>
      </nav>

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
            <h2 className="fw-bold mb-3">¿UN ANTOJO?</h2>
            <p className="mb-4">
              La cafetería de la Universidad Tecnológica del Perú (UTP) en Lima
              Sur busca mejorar la experiencia de sus estudiantes, docentes y
              personal administrativo a través de una plataforma de comercio
              electrónico. Con esta solución podrás visualizar el menú en línea,
              realizar pedidos anticipados, pagar de forma segura y recoger tus
              productos sin largas colas ni tiempos de espera.
            </p>
            <div className="mb-4">
              <button className="btn btn-danger me-3">Reservar</button>
              <button className="btn btn-danger">Ver menú</button>
            </div>

            {/* Atención / Ubicación */}
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

      {/* Footer */}
      <footer
        className="text-white mt-auto py-4"
        style={{ backgroundColor: "#A4001D" }}
      >
        <div className="container text-center">
          <h5 className="mb-3">
            Universidad Tecnológica del Perú - Sede Lima Sur
          </h5>
          <p className="mb-2">
            Inicio de la Panamericana Sur — ingreso a Villa El Salvador (VES),
            Lima Sur
          </p>
          {/* Mapa más pequeño */}
          <div className="d-flex justify-content-center mb-3">
            <div style={{ width: "600px", height: "400px" }}>
              <iframe
                src="https://www.google.com/maps?q=UTP+Lima+Sur+Panamericana+Villa+El+Salvador&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa UTP Lima Sur"
              ></iframe>
            </div>
          </div>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Universidad Tecnológica del Perú -
            Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClienteDashboard;

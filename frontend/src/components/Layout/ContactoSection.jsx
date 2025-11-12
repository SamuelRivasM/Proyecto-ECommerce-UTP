
// src/components/Layout/ContactoSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarGeneral from "./NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import Perfil from "./Perfil";

const ContactoSection = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const navigate = useNavigate();

    // Obtenemos el rol del usuario
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const rol = user?.rol || "cliente";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleVolverInicio = () => {
        switch (rol) {
            case "admin":
                navigate("/admin-dashboard");
                break;
            case "cocina":
                navigate("/cocina-dashboard");
                break;
            default:
                navigate("/cliente-dashboard");
        }
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
                onInicioClick={handleVolverInicio}
                activePage="contacto"
            />

            {/* Contenido central */}
            <section className="container my-5 flex-grow text-center">
                <h2 className="fw-bold mb-4">Contáctanos</h2>
                <p className="mb-3">Universidad Tecnológica del Perú - Sede Lima Sur</p>
                <p>Inicio de la Panamericana Sur - ingreso a Villa El Salvador (VES), Lima Sur</p>

                <div className="d-flex justify-content-center my-4">
                    <div style={{ width: "80%", height: "400px" }}>
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

                <p className="text-muted mb-0">Teléfono: (01) 230-5010</p>
                <p className="text-muted">Correo: informes@utp.edu.pe</p>

                <button className="btn btn-outline-danger mt-3" onClick={handleVolverInicio}>
                    Volver al Inicio
                </button>
            </section>

            {/* Chatbot de Landbot */}
            <LandbotChat />

            {/* Footer */}
            <FooterGeneral />

            {/* Modal Perfil */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ContactoSection;

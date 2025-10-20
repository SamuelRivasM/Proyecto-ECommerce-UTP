
// src/components/Layout/FooterGeneral.jsx
const FooterGeneral = () => {
    return (
        <footer
            className="text-white py-3"
            style={{
                backgroundColor: "#A4001D",
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: 0,
                textAlign: "center",
                zIndex: 100,
            }}
        >
            <p className="mb-0">
                &copy; {new Date().getFullYear()} Universidad Tecnológica del Perú - Todos los derechos reservados.
            </p>
        </footer>
    );
};

export default FooterGeneral;

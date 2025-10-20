
// src/components/Admin/AdminReportes.jsx
import { useState } from "react";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import Perfil from "../Layout/Perfil";

const AdminReportes = () => {
    const [showPerfil, setShowPerfil] = useState(false);

    return (
        <div style={{ backgroundColor: "#FAF7F5", minHeight: "100vh" }}>
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onInicioClick={() => (window.location.href = "/admin-dashboard")}
                onLogout={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
                activePage="reportes"
            />

            {/* === Contenido principal === */}
            <main className="container py-5">
                <h2 className="fw-bold mb-4">Reportes del Sistema</h2>
                <p className="text-muted mb-4">
                    Aquí podrás generar y descargar reportes sobre usuarios, ventas y pedidos.
                </p>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title">📈 Reporte de Ventas</h5>
                                <p className="text-muted">Resumen mensual de ingresos y ventas totales.</p>
                                <button className="btn btn-outline-primary">Generar PDF</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title">👥 Reporte de Usuarios</h5>
                                <p className="text-muted">Usuarios activos, roles y fechas de registro.</p>
                                <button className="btn btn-outline-success">Generar PDF</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title">🛍️ Reporte de Pedidos</h5>
                                <p className="text-muted">Pedidos por estado, método de pago y cliente.</p>
                                <button className="btn btn-outline-danger">Generar PDF</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <h4 className="fw-bold">📊 Historial de reportes generados</h4>
                    <table className="table table-hover mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Generado por</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Reporte de Ventas</td>
                                <td>2025-10-18</td>
                                <td>Sergio Chiquinta</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary">Ver PDF</button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Reporte de Usuarios</td>
                                <td>2025-10-15</td>
                                <td>Oscar Chocce</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-secondary">Ver PDF</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default AdminReportes;

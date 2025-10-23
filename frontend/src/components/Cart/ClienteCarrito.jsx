
// src/components/Cart/ClienteCarrito.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import Perfil from "../Layout/Perfil";
import "./clienteCarrito.css";
import { FaTrashAlt } from "react-icons/fa";

const ClienteCarrito = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState("");
    const [carrito, setCarrito] = useState([]);
    const [numero, setNumero] = useState(1);
    const [metodoPago, setMetodoPago] = useState("efectivo");
    const [fechaEntrega, setFechaEntrega] = useState("");

    // === Obtener categorías y productos ===
    useEffect(() => {
        // Cargar el Carrito al entrar
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
        const carritoConvertido = carritoGuardado.map((item) => ({
            ...item,
            precio: parseFloat(item.precio) || 0,
            subtotal: parseFloat(item.subtotal) || 0,
            cantidad: parseInt(item.cantidad) || 1,
        }));
        setCarrito(carritoConvertido);
        setNumero(carritoConvertido.length + 1);

        const fetchData = async () => {
            try {
                const [resCat, resProd] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/productos/categorias`),
                    axios.get(`${process.env.REACT_APP_API_URL}/productos/cliente`),
                ]);
                setCategorias(resCat.data);
                setProductos(resProd.data);
            } catch (err) {
                toast.error("Error al cargar datos del carrito.");
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // === Productos filtrados por categoría ===
    const productosFiltrados = productos.filter(
        (p) => p.categoria === categoriaSeleccionada
    );

    // === Agregar producto al carrito ===
    const handleAgregarProducto = () => {
        if (!productoSeleccionado) return toast.warning("Seleccione un producto.");

        const prod = productos.find((p) => p.nombre === productoSeleccionado);
        if (!prod) return;

        const existente = carrito.find((item) => item.id === prod.id);
        if (existente) {
            toast.info("El producto ya está en el carrito.");
            return;
        }

        // Si el carrito está vacío, reiniciamos el contador a 1
        const nuevoNumero = carrito.length > 0 ? numero : 1;

        const nuevoItem = {
            numero: nuevoNumero,
            id: prod.id,
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            precio: parseFloat(prod.precio),
            cantidad: 1,
            subtotal: parseFloat(prod.precio),
            imagen: prod.imagen,
        };

        const nuevoCarrito = [...carrito, nuevoItem].map((item, index) => ({
            ...item,
            numero: index + 1,
        }));

        setCarrito(nuevoCarrito);
        setNumero(nuevoCarrito.length + 1);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        window.dispatchEvent(new Event("cartUpdated")); // Actualizar contador del carrito en navbar
        toast.success("Producto agregado al carrito correctamente.");
    };

    // === Eliminar producto del carrito ===
    const eliminarProducto = (id) => {
        const nuevoCarrito = carrito
            .filter((item) => item.id !== id)
            .map((item, index) => ({
                ...item,
                numero: index + 1,
            }));

        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        window.dispatchEvent(new Event("cartUpdated")); // Actualizar contador del carrito en navbar

        // Si ya no queda ningún producto, reiniciamos el contador a 1
        setNumero(nuevoCarrito.length > 0 ? nuevoCarrito.length + 1 : 1);

        toast.info("Producto eliminado del carrito.");
    };

    // === Aumentar o disminuir cantidad ===
    const actualizarCantidad = (id, delta) => {
        setCarrito((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        cantidad: Math.max(1, item.cantidad + delta),
                        subtotal: Math.max(1, item.cantidad + delta) * item.precio,
                    }
                    : item
            )
        );
    };

    // === Calcular total ===
    const total = carrito.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0).toFixed(2);

    // === Método para Solicitar un Pedido ===
    const handleSolicitarPedido = async () => {
        if (carrito.length === 0) return toast.warning("El carrito está vacío.");

        if (!fechaEntrega) return toast.warning("Debe seleccionar la hora de entrega.");

        const ahora = new Date();
        const [horaSel, minSel] = fechaEntrega.split(":").map(Number);
        const fechaSeleccionada = new Date();
        fechaSeleccionada.setHours(horaSel, minSel, 0, 0);

        if (fechaSeleccionada <= ahora) {
            return toast.warning("Seleccione una hora posterior a la actual.");
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return toast.error("Usuario no identificado.");

        try {
            // Verificar stock antes de crear pedido
            const verificarRes = await axios.post(
                `${process.env.REACT_APP_API_URL}/pedidos/cliente/verificar-stock`,
                { carrito }
            );

            if (verificarRes.data.ok !== true) {
                toast.error("Error al verificar stock.");
                return;
            }

            // Crear pedido
            const totalPedido = parseFloat(total);

            // Combinar fecha actual + hora seleccionada
            const hoy = new Date();
            const [horaSel, minSel] = fechaEntrega.split(":").map(Number);
            const fechaEntregaCompleta = new Date(
                hoy.getFullYear(),
                hoy.getMonth(),
                hoy.getDate(),
                horaSel,
                minSel,
                0
            );
            // Formatear manualmente a "YYYY-MM-DD HH:mm:ss" en hora local (Perú)
            const pad = (n) => (n < 10 ? "0" + n : n);
            const fechaEntregaFormateada = `${fechaEntregaCompleta.getFullYear()}-${pad(
                fechaEntregaCompleta.getMonth() + 1
            )}-${pad(fechaEntregaCompleta.getDate())} ${pad(
                fechaEntregaCompleta.getHours()
            )}:${pad(fechaEntregaCompleta.getMinutes())}:00`;

            // Enviar al backend la fecha completa
            await axios.post(`${process.env.REACT_APP_API_URL}/pedidos/cliente/nuevo`, {
                usuarioId: user.id,
                metodoPago,
                carrito,
                total: totalPedido,
                fechaEntrega: fechaEntregaFormateada,
            });

            toast.success("Pedido enviado correctamente.");

            // Limpiar carrito
            setCarrito([]);
            localStorage.removeItem("carrito");
            window.dispatchEvent(new Event("cartUpdated"));
            setNumero(1);
            setFechaEntrega("");

        } catch (error) {
            if (error.response && error.response.data && error.response.data.insuficientes) {
                error.response.data.insuficientes.forEach((prod) => {
                    toast.warning(`"${prod.nombre}" sin stock suficiente (${prod.motivo}).`);
                });
            } else {
                console.error("Error al solicitar pedido:", error);
                toast.error("Error del servidor al registrar el pedido.");
            }
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
                onLogout={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                }}
                onInicioClick={() => (window.location.href = "/cliente-dashboard")}
                activePage="carrito"
            />

            {/* === Contenido principal === */}
            <section className="container my-5 flex-grow">
                <h2 className="fw-bold text-center mb-4">Carrito de Compras</h2>

                {/* === Filtros === */}
                <div className="row mb-4">
                    <div className="col-md-5 mb-3 mb-md-0">
                        <label className="form-label fw-semibold">Categoría</label>
                        <select
                            className="form-select"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.nombre}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-5 mb-3 mb-md-0">
                        <label className="form-label fw-semibold">Producto</label>
                        <select
                            className="form-select"
                            value={productoSeleccionado}
                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                            disabled={!categoriaSeleccionada}
                        >
                            <option value="">Selecciona un producto</option>
                            {productosFiltrados.map((p) => (
                                <option key={p.id} value={p.nombre}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button
                            className="btn btn-danger w-100"
                            onClick={handleAgregarProducto}
                        >
                            Agregar Producto
                        </button>
                    </div>
                </div>

                {/* === Tabla del carrito === */}
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr className="text-center">
                                <th>N°</th>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio Unitario (S/)</th>
                                <th>Cantidad</th>
                                <th>Subtotal (S/)</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.length > 0 ? (
                                carrito.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-center" data-label="N°">
                                            {item.numero}
                                        </td>

                                        <td className="text-center" data-label="Imagen">
                                            {item.imagen ? (
                                                <img
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    style={{
                                                        width: "55px",
                                                        height: "55px",
                                                        borderRadius: "8px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-muted">Sin imagen</span>
                                            )}
                                        </td>

                                        <td className="text-center" data-label="Nombre:">{item.nombre}</td>
                                        <td className="text-center" data-label="Descripción:">{item.descripcion}</td>

                                        <td className="text-center" data-label="Precio Unitario (S/):">
                                            {item.precio.toFixed(2)}
                                        </td>

                                        <td className="text-center" data-label="Cantidad:">
                                            <button
                                                className="btn btn-sm btn-outline-danger me-2"
                                                onClick={() => actualizarCantidad(item.id, -1)}
                                            >
                                                -
                                            </button>
                                            {item.cantidad}
                                            <button
                                                className="btn btn-sm btn-outline-success ms-2"
                                                onClick={() => actualizarCantidad(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </td>

                                        <td
                                            className="text-center fw-semibold"
                                            data-label="Subtotal (S/):"
                                        >
                                            {item.subtotal.toFixed(2)}
                                        </td>

                                        <td className="text-center" data-label="Acciones:">
                                            <div
                                                className="d-flex justify-content-center align-items-center"
                                                style={{ height: "100%" }}
                                            >
                                                <button
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: "36px",
                                                        height: "36px",
                                                        borderRadius: "50%",
                                                    }}
                                                    onClick={() => eliminarProducto(item.id)}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        No hay productos en el carrito.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* === Total y botón === */}
                <div className="d-flex flex-column align-items-end mt-4 gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="fw-bold mb-0">Método de Pago:</h5>
                        <select
                            className="form-select w-auto"
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="billetera">Billetera Digital</option>
                        </select>
                    </div>
                    {/* Campo de fecha y hora de entrega */}
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="fw-bold mb-0">Hora de entrega:</h5>

                        {/* Selector de fecha (solo muestra el día actual y no editable) */}
                        <div className="d-flex align-items-center gap-2">
                            <select className="form-select w-auto" disabled>
                                <option>
                                    {new Date().toLocaleDateString("es-PE", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                    })}
                                </option>
                            </select>

                            {/* Selector de hora (solo horas futuras del día actual) */}
                            <select
                                className="form-select w-auto"
                                value={fechaEntrega}
                                onChange={(e) => setFechaEntrega(e.target.value)}
                                required
                            >
                                <option value="">Selecciona hora</option>
                                {(() => {
                                    const ahora = new Date();
                                    const horas = [];
                                    const inicio = ahora.getHours() + (ahora.getMinutes() > 50 ? 1 : 0);
                                    for (let h = inicio; h <= 23; h++) {
                                        const hora = h.toString().padStart(2, "0");
                                        horas.push(`${hora}:00`);
                                        horas.push(`${hora}:15`);
                                        horas.push(`${hora}:30`);
                                        horas.push(`${hora}:45`);
                                    }
                                    return horas.map((hora) => (
                                        <option key={hora} value={hora}>
                                            {hora}
                                        </option>
                                    ));
                                })()}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="fw-bold mb-0">Total: S/ {total}</h5>
                        <button className="btn btn-success" onClick={handleSolicitarPedido}>
                            Solicitar Pedido
                        </button>
                    </div>
                </div>

            </section>

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </div>
    );
};

export default ClienteCarrito;

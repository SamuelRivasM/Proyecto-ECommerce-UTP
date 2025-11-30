// src/components/Cart/ClienteCarrito.jsx
import { useEffect, useState, useRef, Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import Perfil from "../Layout/Perfil";
import "./clienteCarrito.css";
import "../Layout/modals.css";
import "./ModalPagoQR.css";
import { FaTrashAlt } from "react-icons/fa";
import qrImage from '../../assets/img/QR.jpg';
import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:3000";
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

    // Confirm modal + websocket state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmSwitch, setConfirmSwitch] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [progress, setProgress] = useState(0);
    const [pagoBilletera, setPagoBilletera] = useState(false); // Bandera para pago confirmado en billetera
    const socketRef = useRef(null);
    const [pedidoActualId, setPedidoActualId] = useState(null); // Guardar ID del pedido para actualizar estado_pago

    // === ESTADO NUEVO PARA EL MODAL QR ===
    const [showQrModal, setShowQrModal] = useState(false);

    // === Calcular total ===
    const total = carrito.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0).toFixed(2);

    // === Obtener categorías y productos === (y mantener polling)
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

        const fetchAll = async () => {
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
        fetchAll();

        // Polling cada 10s para refrescar productos
        const intervalo = setInterval(async () => {
            try {
                const resProd = await axios.get(`${process.env.REACT_APP_API_URL}/productos/cliente`);
                // Compara si hay cambios en la lista (por simplicidad actualizamos siempre)
                const nuevos = resProd.data;
                // Si hay productos en carrito que ya no están disponibles -> quitar y avisar
                const disponiblesIds = nuevos.map((p) => p.id);
                const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
                const faltantes = carritoActual.filter((it) => !disponiblesIds.includes(it.id));
                if (faltantes.length > 0) {
                    // Remover del carrito
                    const nuevoCarrito = carritoActual.filter((it) => disponiblesIds.includes(it.id));
                    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
                    setCarrito(nuevoCarrito);
                    setNumero(nuevoCarrito.length > 0 ? nuevoCarrito.length + 1 : 1);
                    faltantes.forEach((f) => toast.warning(`"${f.nombre}" ya no está disponible y fue removido del carrito.`));
                    window.dispatchEvent(new Event("cartUpdated"));
                }
                setProductos(nuevos);
            } catch (err) {
                console.error("Error en polling productos:", err);
            }
        }, 10000);

        return () => clearInterval(intervalo);
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
        setCarrito((prev) => {
            const nuevoCarrito = prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        cantidad: Math.max(1, item.cantidad + delta),
                        subtotal: Math.max(1, item.cantidad + delta) * item.precio,
                    }
                    : item
            );
            localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
            return nuevoCarrito;
        });
    };

    // === Manejador del cambio de Método de Pago ===

    const handleMetodoPagoChange = (e) => {
        const newMetodo = e.target.value;
        setMetodoPago(newMetodo);
        // Cerramos el modal QR por si estaba abierto
        setShowQrModal(false);
    };

    // Obtener primer slot de 15min estrictamente posterior al "ahora" para la fecha de entrega
    const getSlotsForToday = () => {
        const ahora = new Date();
        const slots = [];
        // Calcular próximo intervalo de 15 minutos *estrictamente mayor* que ahora
        const minutes = ahora.getMinutes();
        const seconds = ahora.getSeconds();
        const ms = ahora.getMilliseconds();
        let remainder = minutes % 15;
        let addMin = remainder === 0 && seconds === 0 && ms === 0 ? 15 : (15 - remainder);
        if (remainder === 0 && (seconds > 0 || ms > 0)) addMin = 15; // si está exacto pero ya pasaron segundos
        const primer = new Date(ahora.getTime() + addMin * 60_000 - (seconds * 1000 + ms));
        // Generar hasta 23:45
        const fin = new Date(ahora);
        fin.setHours(23, 45, 0, 0);
        for (let cur = new Date(primer); cur <= fin; cur = new Date(cur.getTime() + 15 * 60_000)) {
            const hh = cur.getHours().toString().padStart(2, "0");
            const mm = cur.getMinutes().toString().padStart(2, "0");
            slots.push(`${hh}:${mm}`);
        }
        return slots;
    };
    const handleOpenConfirm = async () => {
        if (carrito.length === 0) return toast.warning("El carrito está vacío.");
        if (!fechaEntrega) return toast.warning("Debe seleccionar la hora de entrega.");

        if (metodoPago === "billetera") {
            if (parseFloat(total) > 0) {
                // Si es Billetera Digital y el total es > 0, abrir el modal QR
                setShowQrModal(true);
                return;
            } else {
                return toast.warning("No se puede pagar con Billetera Digital si el total es S/ 0.00. Añade productos o cambia el método de pago.");
            }
        }
        try {
            // Verificar stock
            const verificarRes = await axios.post(
                `${process.env.REACT_APP_API_URL}/pedidos/cliente/verificar-stock`,
                { carrito }
            );

            if (verificarRes.data.ok !== true) {
                toast.error("Error al verificar stock.");
                return;
            }
            setConfirmSwitch(false);
            // Abrir el modal de Confirmación para Efectivo/Tarjeta
            setShowConfirmModal(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.insuficientes) {
                error.response.data.insuficientes.forEach((prod) => {
                    toast.warning(`"${prod.nombre}" sin stock suficiente (${prod.motivo}).`);
                });
            } else {
                console.error("Error al verificar stock:", error);
                toast.error("Error del servidor al verificar stock.");
            }
        }
    };

    const handleCloseQrModal = async () => {
        setShowQrModal(false);
        setConfirmSwitch(false);
        setShowConfirmModal(true);
    }

    // === Manejar confirmación de pago en modal QR (Billetera Digital) ===
    const handlePagoRealizadoQR = async () => {
        try {
            // Guardar bandera de que el pago fue confirmado en billetera digital
            setPagoBilletera(true);
            toast.success("Pago confirmado. Completa tu pedido.");

            // Cerrar el modal QR y pasar al modal de confirmación
            setShowQrModal(false);
            setConfirmSwitch(false);
            setShowConfirmModal(true);
        } catch (error) {
            console.error("Error al procesar pago:", error);
            toast.error("Error al procesar el pago.");
        }
    }


    useEffect(() => {
        document.body.classList.add("bootstrap-modal");
        return () => document.body.classList.remove("bootstrap-modal");
    }, []);

    // Iniciar WebSocket UNA SOLA VEZ
    useEffect(() => {
        socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

        // Eventos globales (solo se registran una vez)
        socketRef.current.on("orderProgress", (data) => {
            if (data && typeof data.percent === "number") {
                setProgress(Math.min(100, Math.round(data.percent)));
                setShowProgressModal(true);
            }
        });

        socketRef.current.on("orderComplete", () => {
            setProgress(100);
            toast.success("Pedido enviado correctamente");

            setCarrito([]);
            localStorage.removeItem("carrito");
            window.dispatchEvent(new Event("cartUpdated"));
            setNumero(1);
            setFechaEntrega("");

            setTimeout(() => {
                setShowProgressModal(false);
            }, 800);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // === Realizar pedido (se llama desde modal cuando el usuario confirma) ===
    const handleConfirmarPedido = async () => {
        setShowConfirmModal(false);
        setProgress(0);
        setShowProgressModal(true);

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id) {
                toast.error("Usuario no identificado.");
                return;
            }

            // Convertir la hora seleccionada a datetime completo (hoy)
            const ahora = new Date();
            const [hora, minuto] = fechaEntrega.split(":");
            const fechaCompleta = new Date(
                ahora.getFullYear(),
                ahora.getMonth(),
                ahora.getDate(),
                hora,
                minuto,
                0
            );

            const pad = (n) => String(n).padStart(2, "0");
            const fechaEntregaFormatoMySQL = `${fechaCompleta.getFullYear()}-${pad(
                fechaCompleta.getMonth() + 1
            )}-${pad(fechaCompleta.getDate())} ${pad(
                fechaCompleta.getHours()
            )}:${pad(fechaCompleta.getMinutes())}:00`;

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/pedidos/cliente/nuevo`, {
                usuarioId: user.id,
                metodoPago,
                carrito,
                total: parseFloat(total),
                fechaEntrega: fechaEntregaFormatoMySQL,
                socketId: socketRef.current.id,
            });

            // Actualizar estado_pago a 1 (pagado) según el método de pago
            if (response.data.pedidoId) {
                try {
                    console.log("Intentando actualizar estado_pago para pedido:", response.data.pedidoId);

                    // Para billetera: solo si se confirmó en el modal QR
                    // Para efectivo y tarjeta: siempre se confirma aquí
                    let debeActualizar = false;

                    if (metodoPago === "billetera" && pagoBilletera) {
                        debeActualizar = true;
                    } else if (metodoPago === "efectivo" || metodoPago === "tarjeta") {
                        debeActualizar = true;
                    }

                    if (debeActualizar) {
                        const updateResponse = await axios.put(`${process.env.REACT_APP_API_URL}/pedidos/estado-pago/${response.data.pedidoId}`, {
                            estado_pago: 1
                        });
                        console.log("Estado de pago actualizado exitosamente:", updateResponse.data);
                        toast.success("¡Pago registrado exitosamente!");
                        // Disparar evento para refrescar la tabla de pedidos
                        window.dispatchEvent(new Event("pedidoCreado"));
                    }
                } catch (error) {
                    console.error("Error completo al actualizar estado de pago:", error.response?.data || error.message);
                    toast.error("Error al registrar el pago: " + (error.response?.data?.message || error.message));
                } finally {
                    setPagoBilletera(false);
                }
            }
        } catch (error) {
            toast.error("Error procesando pedido.");
            setShowProgressModal(false);
        }
    };
    // === Cuando polling detecta producto no disponible en catálogo y en combobox ya no aparece (handled) ===

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
                            className="btn btn-danger w-100 fw-bold"
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
                            onChange={handleMetodoPagoChange}
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
                                {getSlotsForToday().map((hora) => (
                                    <option key={hora} value={hora}>
                                        {hora}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="fw-bold mb-0">Total: S/ {total}</h5>
                        <button className="btn btn-success fw-bold" onClick={handleOpenConfirm}>
                            Solicitar Pedido
                        </button>
                    </div>
                </div>
            </section>

            {/* **=== Modal de Pago QR (Abre solo con Billetera Digital) ===** */}
            {showQrModal && (
                <>
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content text-center">
                                <div className="modal-header bg-danger text-white border-0 p-3">
                                    <h5 className="modal-title fs-5 fw-bold w-100">
                                        Pago con Billetera Digital
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={handleCloseQrModal}
                                    />
                                </div>
                                <div className="modal-body p-4">
                                    <p className="fw-semibold mb-3">
                                        Escanea el código QR para completar tu pago de <span className="text-danger fw-bold">S/ {total}</span>:
                                    </p>

                                    {/* Contenedor del QR con estilos inyectados o de ModalPagoQR.css */}
                                    <div style={{ maxWidth: '200px', margin: '0 auto', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                        <img
                                            src={qrImage}
                                            alt="Código QR de Pago"
                                            className="img-fluid"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                aspectRatio: '1 / 1',
                                                display: 'block'
                                            }}
                                        />
                                    </div>

                                    <p className="mt-3 text-muted small">
                                        Una vez realizado el pago, puedes cerrar esta ventana.
                                    </p>
                                </div>
                                <div className="modal-footer justify-content-center p-3">
                                    <button
                                        type="button"
                                        className="btn btn-success w-100 fw-bold"
                                        onClick={handlePagoRealizadoQR}
                                    >
                                        Pago realizado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Overlay */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* === Modal de Confirmación (advertencia) === */}
            {showConfirmModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmación del Pedido</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)} />
                            </div>
                            <div className="modal-body">
                                <p className="text-danger fw-semibold">
                                    <strong>Advertencia:</strong> El pedido no podrá ser cancelado una vez enviado. La cocina
                                    descontará ingredientes inmediatamente.
                                </p>
                                <p>¿Deseas continuar con el envío del pedido?</p>

                                <div className="form-check form-switch mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="confirmSwitch"
                                        checked={confirmSwitch}
                                        onChange={(e) => setConfirmSwitch(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="confirmSwitch">
                                        Activar para habilitar "Solicitar Pedido"
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    disabled={!confirmSwitch}
                                    onClick={handleConfirmarPedido}
                                >
                                    Solicitar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Overlay del modal */}
            {showConfirmModal && <div className="modal-backdrop fade show"></div>}

            {/* === Modal de Progreso WebSocket === */}
            {showProgressModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-sm modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Enviando pedido...</h5>
                                <button type="button" className="btn-close" onClick={() => setShowProgressModal(false)} />
                            </div>
                            <div className="modal-body">
                                {/* Lógica del progreso */}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
            <LandbotChat />
            <FooterGeneral />
        </div>
    );
};

export default ClienteCarrito;
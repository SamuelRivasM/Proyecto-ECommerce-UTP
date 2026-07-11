
// src/components/Cocina/CocinaProductos.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Perfil from "../Layout/Perfil";
import NavbarGeneral from "../Layout/NavbarGeneral";
import FooterGeneral from "../Layout/FooterGeneral";
import LandbotChat from "../Layout/LandbotChat";
import "./cocinaProductos.css";
import useGlobalLogout from "../../hooks/useGlobalLogout";

const CocinaProductos = () => {
    const navigate = useNavigate();
    const [showPerfil, setShowPerfil] = useState(false);
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filtro, setFiltro] = useState("");
    const [criterio, setCriterio] = useState("todos");
    const itemsPorPagina = 15;
    const [productoEdit, setProductoEdit] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
    });
    const [imagenNueva, setImagenNueva] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/productos/categorias`)
            .then(res => setCategorias(res.data))
            .catch(() => toast.error("Error al cargar categorías"));
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/productos/cocina`);
                setProductos(response.data);
            } catch {
                toast.error("Error al obtener productos");
            }
        };

        // Llamada inicial
        fetchProductos();

        // Polling cada 3 segundos
        const interval = setInterval(fetchProductos, 3000);

        // Limpieza para evitar duplicados de intervalos
        return () => clearInterval(interval);
    }, []);

    // Función de Editar Producto
    const handleEditar = (prod) => {
        setProductoEdit({ ...prod });
    };

    // Función para Activar / Desactivar producto
    const handleCambiarEstado = async (prod) => {
        try {
            const nuevoEstado = prod.disponible ? 0 : 1;

            await axios.patch(
                `${process.env.REACT_APP_API_URL}/productos/cocina/${prod.id}/estado`,
                { disponible: nuevoEstado }
            );

            setProductos((prev) =>
                prev.map((p) =>
                    p.id === prod.id ? { ...p, disponible: nuevoEstado } : p
                )
            );

            toast.success(`Producto ${nuevoEstado ? "activado" : "desactivado"} correctamente`);
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            toast.error("Error al cambiar el estado del producto");
        }
    };

    // Función para Guardar luego de Editar
    const handleGuardarCambios = async () => {
        // Validación de precio
        const precioNum = Number(productoEdit.precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            toast.warning("El precio debe ser un número mayor a 0");
            return;
        }
        // Validación de stock (opcional, pero evita negativos)
        const stockNum = Number(productoEdit.stock);
        if (isNaN(stockNum) || stockNum < 0) {
            toast.warning("El stock no puede ser negativo");
            return;
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/productos/cocina/${productoEdit.id}`,
                {
                    nombre: productoEdit.nombre,
                    descripcion: productoEdit.descripcion,
                    precio: precioNum,
                    stock: stockNum,
                    categoria_id: categorias.find(c => c.nombre === productoEdit.categoria)?.id
                }
            );

            // Refrescar en el frontend sin recargar
            setProductos(prev =>
                prev.map(p =>
                    p.id === productoEdit.id ? productoEdit : p
                )
            );

            toast.success("Producto actualizado correctamente");
            setProductoEdit(null);
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar");
        }
    };

    // Función para Crear Producto
    // Función para Crear Producto
    const handleCrearProducto = async () => {
        if (!nuevoProducto.nombre || !nuevoProducto.precio) {
            toast.warning("Nombre y precio son obligatorios");
            return;
        }

        const precioNum = Number(nuevoProducto.precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            toast.warning("El precio debe ser un número mayor a 0");
            return;
        }

        const stockNum = Number(nuevoProducto.stock);
        if (isNaN(stockNum) || stockNum < 0) {
            toast.warning("El stock no puede ser negativo");
            return;
        }

        try {
            // 1. Crear el producto
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/productos/cocina`,
                {
                    nombre: nuevoProducto.nombre,
                    descripcion: nuevoProducto.descripcion,
                    precio: precioNum,
                    stock: stockNum,
                    categoria_id: categorias.find(c => c.nombre === nuevoProducto.categoria)?.id
                }
            );

            const nuevoId = response.data.id;

            // 2. Si hay imagen, subirla
            if (imagenNueva && nuevoId) {
                const formData = new FormData();
                formData.append("imagen", imagenNueva);

                try {
                    await axios.post(
                        `${process.env.REACT_APP_API_URL}/productos/upload/${nuevoId}`,
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                } catch (imgError) {
                    console.error("Error al subir imagen del nuevo producto:", imgError);
                    toast.warning("El producto se creó, pero hubo un error al subir la imagen");
                }
            }

            // 3. Refrescar la lista de productos desde el servidor
            const productosActualizados = await axios.get(`${process.env.REACT_APP_API_URL}/productos/cocina`);
            setProductos(productosActualizados.data);

            // 4. Limpiar y cerrar modal
            toast.success("Producto creado correctamente");
            setMostrarModalCrear(false);
            setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "" });
            setImagenNueva(null); // Limpiar también la imagen seleccionada

        } catch (error) {
            console.error("Error al crear producto:", error);
            toast.error("Error al crear producto");
        }
    };

    // Subida de imagen con Cloudinary
    const handleCambiarImg = async (idProducto) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("imagen", file);

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/productos/upload/${idProducto}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                setProductos((prev) =>
                    prev.map((p) =>
                        p.id === idProducto ? { ...p, imagen: response.data.url } : p
                    )
                );

                toast.success("Imagen actualizada correctamente");
            } catch (error) {
                console.error("Error al subir imagen:", error);
                toast.error("Error al subir imagen");
            }
        };

        input.click();
    };

    // Filtrado
    const productosFiltrados = productos.filter((p) => {
        if (criterio === "todos" || filtro.trim() === "") return true;
        const valor = filtro.toLowerCase();
        switch (criterio) {
            case "id":
                return p.id.toString() === valor;
            case "nombre":
                return p.nombre.toLowerCase().includes(valor);
            case "descripcion":
                return p.descripcion.toLowerCase().includes(valor);
            case "precio":
                return p.precio.toString().includes(valor);
            case "stock":
                return p.stock.toString().includes(valor);
            case "categoria":
                return p.categoria.toLowerCase().includes(valor);
            case "estado":
                return (p.disponible ? "activo" : "inactivo").includes(valor);
            default:
                return true;
        }
    });

    // Paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
    const inicio = (currentPage - 1) * itemsPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, inicio + itemsPorPagina);

    const handleLogout = useGlobalLogout();

    return (
        <div className="section-container">
            {/* Navbar General */}
            <NavbarGeneral
                onPerfilClick={() => setShowPerfil(true)}
                onLogout={handleLogout}
                onInicioClick={() => navigate("/cocina-dashboard")}
                activePage="lista de productos"
            />

            {/* === Contenido principal === */}
            <div className="container my-4">
                <h1 className="sr-only">Lista de Productos - UTP Coffee Point (Cocina)</h1>
                <h2 className="fw-bold text-center mb-4">Lista de Productos</h2>

                <div className="d-flex justify-content-end mb-3">
                    <button
                        className="btn btn-danger fw-bold"
                        onClick={() => setMostrarModalCrear(true)}
                    >
                        + Agregar Producto
                    </button>
                </div>

                {/* === Filtro === */}
                <div className="input-group mb-4 shadow-sm" style={{ maxWidth: "650px", height: "50px", margin: "0 auto" }}>
                    <span className="input-group-text bg-white border-end-0" style={{ fontSize: "1.2rem", height: "50px" }} aria-hidden="true">🔍</span>
                    <label htmlFor="cocina-productos-criterio" className="sr-only">Filtrar productos por</label>
                    <select
                        id="cocina-productos-criterio"
                        className="form-select border-start-0 border-end-0"
                        value={criterio}
                        onChange={(e) => {
                            setCriterio(e.target.value);
                            setFiltro("");
                        }}
                        style={{ maxWidth: "150px", height: "50px" }}
                    >
                        <option value="todos">Todos</option>
                        <option value="id">ID</option>
                        <option value="nombre">Nombre</option>
                        <option value="descripcion">Descripción</option>
                        <option value="precio">Precio (S/)</option>
                        <option value="stock">Stock</option>
                        <option value="categoria">Categoría</option>
                        <option value="estado">Estado</option>
                    </select>
                    <label htmlFor="cocina-productos-valor" className="sr-only">
                        {criterio === "todos" ? "Mostrar todos los productos" : `Buscar por ${criterio}`}
                    </label>
                    <input
                        id="cocina-productos-valor"
                        type="text"
                        className="form-control border-start-0"
                        placeholder={criterio === "todos" ? "Mostrar todos" : `Buscar por ${criterio}...`}
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        disabled={criterio === "todos"}
                        style={{
                            height: "50px",
                            backgroundColor: criterio === "todos" ? "#f5f5f5" : "white",
                        }}
                    />
                </div>

                {/* === Tabla === */}
                <div className="table-container">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio (S/)</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosPagina.length > 0 ? (
                                productosPagina.map((prod) => (
                                    <tr key={prod.id}>
                                        <td data-label="ID">{prod.id}</td>
                                        <td data-label="Imagen">
                                            {prod.imagen ? (
                                                <img
                                                    src={prod.imagen}
                                                    alt=""
                                                    className="product-image"
                                                />
                                            ) : (
                                                <div className="no-img">Sin IMG</div>
                                            )}
                                        </td>
                                        <td data-label="Nombre:">{prod.nombre}</td>
                                        <td data-label="Descripción:">{prod.descripcion}</td>
                                        <td data-label="Precio (S/):">{prod.precio}</td>
                                        <td data-label="Stock:">{prod.stock}</td>
                                        <td data-label="Categoría:">{prod.categoria}</td>
                                        <td data-label="Estado:">{prod.disponible ? "Activo" : "Inactivo"}</td>
                                        <td data-label="Acciones:" className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-primary fw-bold"
                                                onClick={() => handleEditar(prod)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary fw-bold"
                                                onClick={() => handleCambiarImg(prod.id)}
                                            >
                                                Cambiar IMG
                                            </button>
                                            <button
                                                className="btn btn-sm btn-dark fw-bold"
                                                onClick={() => handleCambiarEstado(prod)}
                                            >
                                                Cambiar Estado
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        No se encontraron resultados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="pagination">
                        {Array.from({ length: totalPaginas }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <br />
            <br />

            {/* Modal para editar producto */}
            {productoEdit && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h5 className="mb-3 fw-bold">Editar Producto</h5>

                        <label>Nombre</label>
                        <input className="form-control mb-2"
                            value={productoEdit.nombre}
                            onChange={(e) => setProductoEdit(prev => ({ ...prev, nombre: e.target.value }))} />

                        <label>Descripción</label>
                        <textarea className="form-control mb-2"
                            value={productoEdit.descripcion}
                            onChange={(e) => setProductoEdit(prev => ({ ...prev, descripcion: e.target.value }))} />

                        <label>Precio (S/)</label>
                        <input type="number" step="0.01" min="0.01" className="form-control mb-2"
                            value={productoEdit.precio}
                            onChange={(e) => setProductoEdit(prev => ({ ...prev, precio: e.target.value }))} />

                        <label>Stock</label>
                        <input type="number" min="0" className="form-control mb-2"
                            value={productoEdit.stock}
                            onChange={(e) => setProductoEdit(prev => ({ ...prev, stock: e.target.value }))} />

                        <label>Categoría</label>
                        <select className="form-control mb-4"
                            value={productoEdit.categoria}
                            onChange={(e) => setProductoEdit(prev => ({ ...prev, categoria: e.target.value }))}>
                            {categorias.map(c => (
                                <option key={c.id} value={c.nombre}>{c.nombre}</option>
                            ))}
                        </select>

                        <div className="d-flex gap-3">
                            <button className="btn btn-success fw-bold" onClick={handleGuardarCambios}>
                                Guardar
                            </button>
                            <button className="btn btn-danger fw-bold" onClick={() => setProductoEdit(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para crear producto */}
            {mostrarModalCrear && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h5 className="mb-3 fw-bold">Agregar Producto</h5>

                        <label htmlFor="nuevo-producto-nombre" className="form-label">Nombre</label>
                        <input
                            id="nuevo-producto-nombre"
                            className="form-control mb-2"
                            value={nuevoProducto.nombre}
                            onChange={(e) => setNuevoProducto(prev => ({ ...prev, nombre: e.target.value }))}
                        />

                        <label htmlFor="nuevo-producto-descripcion" className="form-label">Descripción</label>
                        <textarea
                            id="nuevo-producto-descripcion"
                            className="form-control mb-2"
                            value={nuevoProducto.descripcion}
                            onChange={(e) => setNuevoProducto(prev => ({ ...prev, descripcion: e.target.value }))}
                        />

                        <label htmlFor="nuevo-producto-precio" className="form-label">Precio (S/)</label>
                        <input type="number" step="0.01" min="0.01" className="form-control mb-2"
                            id="nuevo-producto-precio"
                            value={nuevoProducto.precio}
                            onChange={(e) => setNuevoProducto(prev => ({ ...prev, precio: e.target.value }))} />

                        <label htmlFor="nuevo-producto-imagen" className="form-label">Imagen</label>
                        <input
                            id="nuevo-producto-imagen"
                            type="file"
                            accept="image/*"
                            className="form-control mb-2"
                            onChange={(e) => setImagenNueva(e.target.files[0] || null)}
                        />

                        <label htmlFor="nuevo-producto-stock" className="form-label">Stock</label>
                        <input type="number" min="0" className="form-control mb-1"
                            id="nuevo-producto-stock"
                            value={nuevoProducto.stock}
                            onChange={(e) => setNuevoProducto(prev => ({ ...prev, stock: e.target.value }))} />
                        <small className={`d-block mb-2 fw-semibold ${Number(nuevoProducto.stock) > 0 ? "text-success" : "text-danger"}`}>
                            Estado: {Number(nuevoProducto.stock) > 0 ? "Activo" : "Inactivo"} (según el stock)
                        </small>

                        <label htmlFor="nuevo-producto-categoria" className="form-label">Categoría</label>
                        <select
                            id="nuevo-producto-categoria"
                            className="form-control mb-4"
                            value={nuevoProducto.categoria}
                            onChange={(e) => setNuevoProducto(prev => ({ ...prev, categoria: e.target.value }))}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.nombre}>{c.nombre}</option>
                            ))}
                        </select>

                        <div className="d-flex gap-3">
                            <button className="btn btn-success fw-bold" onClick={handleCrearProducto}>
                                Crear
                            </button>
                            <button
                                className="btn btn-danger fw-bold"
                                onClick={() => {
                                    setMostrarModalCrear(false);
                                    setNuevoProducto({ nombre: "", descripcion: "", precio: "", stock: "", categoria: "" });
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chatbot de Landbot */}
            <LandbotChat />

            {/* Footer */}
            <FooterGeneral />

            {/* Perfil modal */}
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}

        </div>
    );
};

export default CocinaProductos;

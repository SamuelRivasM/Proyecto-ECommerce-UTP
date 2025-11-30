
// backend/controllers/pedidoController.js
const db = require("../models/db");

// === Obtener pedidos de un cliente ===
exports.obtenerPedidosPorCliente = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const [pedidos] = await db.promise().query(`
      SELECT 
        id,
        metodo_pago,
        estado,
        estado_pago,
        total,
        DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
        DATE_FORMAT(fecha_entrega, '%Y-%m-%d %H:%i:%s') AS fecha_entrega
      FROM pedidos
      WHERE usuario_id = ?
      ORDER BY fecha_creacion DESC
    `, [usuarioId]);

        const pedidosNumerados = pedidos
            .slice()
            .reverse()
            .map((p, i) => ({
                numero: i + 1,
                ...p,
            }))
            .reverse();

        res.json(pedidosNumerados);
    } catch (error) {
        console.error("Error al obtener pedidos del cliente:", error);
        res.status(500).json({ message: "Error al obtener los pedidos del cliente" });
    }
};

// === Obtener detalle de un pedido ===
exports.obtenerDetallePedido = async (req, res) => {
    const { pedidoId } = req.params;

    try {
        const [detalle] = await db.promise().query(`
            SELECT 
                dp.id,
                p.nombre AS producto,
                dp.cantidad,
                p.precio,
                dp.subtotal
            FROM detalle_pedido dp
            INNER JOIN productos p ON dp.producto_id = p.id
            WHERE dp.pedido_id = ?;
        `, [pedidoId]);

        res.json(detalle);
    } catch (error) {
        console.error("Error al obtener detalle del pedido:", error);
        res.status(500).json({ message: "Error al obtener el detalle del pedido" });
    }
};

// === Crear nuevo pedido ===
exports.crearPedido = async (req, res) => {
    const { usuarioId, metodoPago, carrito, total, fechaEntrega, socketId } = req.body;

    if (!usuarioId || !metodoPago || !carrito || carrito.length === 0 || !fechaEntrega) {
        return res.status(400).json({ message: "Datos incompletos para crear el pedido." });
    }

    const connection = await db.promise().getConnection();
    const io = req.app.get("io");

    try {
        await connection.beginTransaction();

        const [pedidoResult] = await connection.query(
            `INSERT INTO pedidos (usuario_id, metodo_pago, total, estado, fecha_entrega)
             VALUES (?, ?, ?, 'pendiente', ?)`,
            [usuarioId, metodoPago, total, fechaEntrega]
        );

        const pedidoId = pedidoResult.insertId;

        // Emitir inicio SOLO a ese cliente
        if (io && socketId) {
            io.to(socketId).emit("orderProgress", { pedidoId, percent: 10 });
        }

        const totalItems = carrito.length;
        let processed = 0;

        for (const item of carrito) {
            await connection.query(
                `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
                 VALUES (?, ?, ?, ?)`,
                [pedidoId, item.id, item.cantidad, item.subtotal]
            );

            await connection.query(
                `UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE id = ?`,
                [item.cantidad, item.id]
            );

            processed++;
            const percent = 10 + Math.round((processed / totalItems) * 80);

            if (io && socketId) {
                io.to(socketId).emit("orderProgress", { pedidoId, percent });
            }
        }

        await connection.commit();

        if (io && socketId) {
            io.to(socketId).emit("orderProgress", { pedidoId, percent: 100 });
            io.to(socketId).emit("orderComplete", { pedidoId });
        }

        res.status(201).json({
            message: "Pedido registrado correctamente.",
            pedidoId
        });

        console.log("Pedido creado correctamente, ID:", pedidoId);
    } catch (error) {
        await connection.rollback();
        console.error("Error al crear pedido:", error);

        if (io && socketId) {
            io.to(socketId).emit("orderError", { message: "Error al crear el pedido." });
        }

        res.status(500).json({ message: "Error al registrar el pedido.", error: error.message });
    } finally {
        connection.release();
    }
};

// === Verificar stock de los productos antes del pedido ===
exports.verificarStock = async (req, res) => {
    const { carrito } = req.body;

    if (!carrito || carrito.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío." });
    }

    try {
        const ids = carrito.map(p => p.id);
        const [productos] = await db.promise().query(
            `SELECT id, nombre, stock FROM productos WHERE id IN (?)`,
            [ids]
        );

        const insuficientes = [];

        for (const item of carrito) {
            const prodBD = productos.find(p => p.id === item.id);
            if (!prodBD) {
                insuficientes.push({
                    nombre: item.nombre,
                    motivo: "El producto no existe."
                });
            } else if (item.cantidad > prodBD.stock) {
                insuficientes.push({
                    nombre: prodBD.nombre,
                    motivo: `Solo hay ${prodBD.stock} unidades disponibles.`
                });
            }
        }

        if (insuficientes.length > 0) {
            return res.status(400).json({
                message: "Algunos productos no tienen suficiente stock.",
                insuficientes
            });
        }

        res.json({ ok: true });
    } catch (error) {
        console.error("Error al verificar stock:", error);
        res.status(500).json({ message: "Error al verificar stock." });
    }
};

// === Obtener pedidos para cocina con orden inteligente ===
exports.obtenerPedidosParaCocina = async (req, res) => {
    try {
        const [pedidos] = await db.promise().query(`
      SELECT p.id, p.usuario_id, u.nombre AS cliente_nombre, u.telefono AS cliente_telefono,
             p.metodo_pago, p.estado, p.total,
             DATE_FORMAT(p.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
             DATE_FORMAT(p.fecha_entrega, '%Y-%m-%d %H:%i:%s') AS fecha_entrega
      FROM pedidos p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY 
        CASE 
          WHEN p.estado = 'en preparación' THEN 1
          WHEN p.estado = 'pendiente' THEN 2
          WHEN p.estado = 'listo' THEN 3
          WHEN p.estado = 'entregado' THEN 4
          ELSE 5
        END,
        p.fecha_entrega ASC,
        p.id ASC;
    `);

        res.json(pedidos);
    } catch (error) {
        console.error("Error al obtener pedidos para cocina:", error);
        res.status(500).json({ message: "Error al obtener pedidos para cocina" });
    }
};

// === Actualizar estado del pedido y fecha_entrega si corresponde ===
exports.actualizarEstadoPedido = async (req, res) => {
    const { pedidoId } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'en preparación', 'listo', 'entregado'];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ message: "Estado no válido" });
    }

    try {
        // Si el estado es 'listo' o 'entregado', se actualiza fecha_entrega también
        const debeActualizarFecha = (estado === "listo" || estado === "entregado");

        const query = debeActualizarFecha
            ? "UPDATE pedidos SET estado = ?, fecha_entrega = NOW() WHERE id = ?"
            : "UPDATE pedidos SET estado = ? WHERE id = ?";

        const [result] = await db.promise().query(query, [estado, pedidoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.json({
            message: `Pedido actualizado a: ${estado}`,
            fecha_entrega_actualizada: debeActualizarFecha
        });
    } catch (error) {
        console.error("Error al actualizar estado del pedido:", error);
        res.status(500).json({ message: "Error al actualizar estado" });
    }
};

// === Actualizar estado de pago (0 = no pagado, 1 = pagado) ===
exports.actualizarEstadoPago = async (req, res) => {
    const { pedidoId } = req.params;
    const { estado_pago } = req.body;

    if (typeof estado_pago !== 'number' || ![0, 1].includes(estado_pago)) {
        return res.status(400).json({ message: "Estado de pago inválido. Debe ser 0 o 1." });
    }

    try {
        const [result] = await db.promise().query(
            "UPDATE pedidos SET estado_pago = ? WHERE id = ?",
            [estado_pago, pedidoId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.json({
            message: `Estado de pago actualizado a: ${estado_pago === 1 ? 'Pagado' : 'No pagado'}`,
            estado_pago
        });
    } catch (error) {
        console.error("Error al actualizar estado de pago:", error);
        res.status(500).json({ message: "Error al actualizar estado de pago" });
    }
};

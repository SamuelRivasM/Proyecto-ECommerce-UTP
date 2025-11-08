
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
    const { usuarioId, metodoPago, carrito, total, fechaEntrega } = req.body;

    if (!usuarioId || !metodoPago || !carrito || carrito.length === 0 || !fechaEntrega) {
        return res.status(400).json({ message: "Datos incompletos para crear el pedido." });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // Insertar pedido principal con fecha_entrega
        const [pedidoResult] = await connection.query(
            `INSERT INTO pedidos (usuario_id, metodo_pago, total, estado, fecha_entrega)
             VALUES (?, ?, ?, 'pendiente', ?)`,
            [usuarioId, metodoPago, total, fechaEntrega]
        );

        const pedidoId = pedidoResult.insertId;

        // Insertar cada producto en detalle_pedido
        for (const item of carrito) {
            await connection.query(
                `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
                 VALUES (?, ?, ?, ?)`,
                [pedidoId, item.id, item.cantidad, item.subtotal]
            );

            // Reducir stock
            await connection.query(
                `UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE id = ?`,
                [item.cantidad, item.id]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "Pedido registrado correctamente.",
            pedidoId: pedidoId,
        });
        console.log("Pedido creado correctamente, ID:", pedidoId);
    } catch (error) {
        await connection.rollback();
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Error al registrar el pedido.", error: error.message });
    } finally {
        connection.release();
    }
};

// === Obtener pedidos para la cocina ordenados por llegada (FIFO) ===
exports.obtenerPedidosParaCocina = async (req, res) => {
    try {
        const [pedidos] = await db.promise().query(`
            SELECT 
                p.id,
                p.usuario_id,
                u.nombre AS cliente_nombre,
                u.telefono AS cliente_telefono,
                p.metodo_pago,
                p.estado,
                p.total,
                DATE_FORMAT(p.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
                DATE_FORMAT(p.fecha_entrega, '%Y-%m-%d %H:%i:%s') AS fecha_entrega,
                TIME_FORMAT(TIMEDIFF(NOW(), p.fecha_creacion), '%H:%i:%s') AS tiempo_transcurrido
            FROM pedidos p
            INNER JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.estado IN ('pendiente', 'en_preparacion', 'listo')
            ORDER BY p.fecha_creacion ASC
        `);

        // Obtener detalles de cada pedido
        const pedidosConDetalle = await Promise.all(
            pedidos.map(async (pedido) => {
                const [detalle] = await db.promise().query(`
                    SELECT 
                        dp.id,
                        p.nombre AS producto,
                        dp.cantidad,
                        p.precio,
                        dp.subtotal,
                        c.nombre AS categoria
                    FROM detalle_pedido dp
                    INNER JOIN productos p ON dp.producto_id = p.id
                    LEFT JOIN categorias c ON p.categoria_id = c.id
                    WHERE dp.pedido_id = ?
                    ORDER BY c.nombre, p.nombre
                `, [pedido.id]);

                return {
                    ...pedido,
                    productos: detalle,
                    total_productos: detalle.reduce((sum, item) => sum + item.cantidad, 0)
                };
            })
        );

        // Numerar los pedidos según el orden de llegada
        const pedidosNumerados = pedidosConDetalle.map((pedido, index) => ({
            ...pedido,
            numero_orden: index + 1
        }));

        res.json(pedidosNumerados);
    } catch (error) {
        console.error("Error al obtener pedidos para cocina:", error);
        res.status(500).json({ message: "Error al obtener pedidos para cocina" });
    }
};

// === Actualizar estado de pedido (para cocina) ===
exports.actualizarEstadoPedido = async (req, res) => {
    const { pedidoId } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ message: "Estado no válido" });
    }

    try {
        const [result] = await db.promise().query(
            `UPDATE pedidos SET estado = ? WHERE id = ?`,
            [estado, pedidoId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.json({ message: `Pedido actualizado a estado: ${estado}` });
        console.log(`Pedido ${pedidoId} actualizado a estado: ${estado}`);
    } catch (error) {
        console.error("Error al actualizar estado del pedido:", error);
        res.status(500).json({ message: "Error al actualizar el estado del pedido" });
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

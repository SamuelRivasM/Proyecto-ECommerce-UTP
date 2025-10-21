
// backend/controllers/pedidoController.js
const db = require("../models/db");

// === Obtener pedidos de un cliente ===
exports.obtenerPedidosPorCliente = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const [pedidos] = await db.promise().query(
            `
      SELECT 
        id,
        metodo_pago,
        estado,
        total,
        DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha
      FROM pedidos
      WHERE usuario_id = ?
      ORDER BY fecha DESC
      `,
            [usuarioId]
        );

        // Asignar numeración dinámica inversa (más antiguo = 1)
        const pedidosNumerados = pedidos
            .slice()
            .reverse()
            .map((p, i) => ({
                numero: i + 1,
                ...p,
            }))
            .reverse(); // reordenamos a descendente nuevamente

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
    const { usuarioId, metodoPago, carrito, total } = req.body;

    if (!usuarioId || !metodoPago || !carrito || carrito.length === 0) {
        return res.status(400).json({ message: "Datos incompletos para crear el pedido." });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        // Insertar pedido principal
        const [pedidoResult] = await connection.query(
            `INSERT INTO pedidos (usuario_id, metodo_pago, total, estado)
       VALUES (?, ?, ?, 'pendiente')`,
            [usuarioId, metodoPago, total]
        );

        const pedidoId = pedidoResult.insertId;

        // Insertar cada producto en detalle_pedido
        for (const item of carrito) {
            await connection.query(
                `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
         VALUES (?, ?, ?, ?)`,
                [pedidoId, item.id, item.cantidad, item.subtotal]
            );

            // Reducir stock del producto
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
        console.error(error.stack);
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

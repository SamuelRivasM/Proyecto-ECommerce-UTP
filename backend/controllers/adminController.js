
const db = require("../models/db");

// === Dashboard completo ===
exports.getStats = async (req, res) => {
  try {
    // === Usuarios ===
    const [[usuariosTotal]] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM usuarios"
    );

    const [[clientes]] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'cliente'"
    );
    const [[admins]] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'admin'"
    );
    const [[cocina]] = await db.promise().query(
      "SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'cocina'"
    );

    // === Pedidos del mes actual ===
    const [[pedidosMes]] = await db.promise().query(`
      SELECT COUNT(*) AS total
      FROM pedidos
      WHERE MONTH(fecha) = MONTH(CURDATE()) 
      AND YEAR(fecha) = YEAR(CURDATE())
    `);

    // === Ventas del mes actual ===
    const [[ventasMes]] = await db.promise().query(`
      SELECT IFNULL(SUM(total), 0) AS total
      FROM pedidos
      WHERE MONTH(fecha) = MONTH(CURDATE()) 
      AND YEAR(fecha) = YEAR(CURDATE())
    `);

    // === Productos más vendidos (Top 5) ===
    const [productosTop] = await db.promise().query(`
      SELECT p.nombre, SUM(dp.cantidad) AS cantidad
      FROM detalle_pedido dp
      JOIN productos p ON dp.producto_id = p.id
      GROUP BY p.id
      ORDER BY cantidad DESC
      LIMIT 5
    `);

    // === Últimos usuarios registrados (5) ===
    const [usuariosRecientes] = await db.promise().query(`
      SELECT id, nombre, email, rol, fecha_registro
      FROM usuarios
      ORDER BY fecha_registro DESC
      LIMIT 5
    `);

    // === Respuesta ===
    res.json({
      stats: {
        totalUsuarios: usuariosTotal.total,
        clientes: clientes.total,
        admins: admins.total,
        cocina: cocina.total,
        pedidosMes: pedidosMes.total,
        ventasMes: ventasMes.total || 0,
      },
      productosTop,
      usuariosRecientes,
    });
  } catch (error) {
    console.error("Error en getStats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};

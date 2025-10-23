
// backend/controllers/adminController.js
const db = require("../models/db");

function getCondicionFecha(periodo) {
  const campo = "fecha_creacion"; // o "fecha_entrega" si eliminaste la anterior
  switch (periodo) {
    case "dia":
      return `DATE(${campo}) = CURDATE()`;
    case "semana":
      return `YEARWEEK(${campo}, 1) = YEARWEEK(CURDATE(), 1)`;
    case "mes":
      return `MONTH(${campo}) = MONTH(CURDATE()) AND YEAR(${campo}) = YEAR(CURDATE())`;
    case "trimestre":
      return `QUARTER(${campo}) = QUARTER(CURDATE()) AND YEAR(${campo}) = YEAR(CURDATE())`;
    case "semestre":
      return `
        CEIL(MONTH(${campo}) / 6) = CEIL(MONTH(CURDATE()) / 6)
        AND YEAR(${campo}) = YEAR(CURDATE())
      `;
    case "año":
      return `YEAR(${campo}) = YEAR(CURDATE())`;
    default:
      return `MONTH(${campo}) = MONTH(CURDATE()) AND YEAR(${campo}) = YEAR(CURDATE())`;
  }
}

// === Total de usuarios ===
exports.getUsuariosStats = async (req, res) => {
  try {
    const [[usuariosTotal]] = await db.promise().query("SELECT COUNT(*) AS total FROM usuarios");
    const [[clientes]] = await db.promise().query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'cliente'");
    const [[admins]] = await db.promise().query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'admin'");
    const [[cocina]] = await db.promise().query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'cocina'");

    res.json({
      totalUsuarios: usuariosTotal.total,
      clientes: clientes.total,
      admins: admins.total,
      cocina: cocina.total
    });
  } catch (error) {
    console.error("Error en getUsuariosStats:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// === Pedidos ===
exports.getPedidosStats = async (req, res) => {
  try {
    const periodo = req.query.periodo || "mes";
    const condicionFecha = getCondicionFecha(periodo);
    const [[pedidosPeriodo]] = await db.promise().query(`
      SELECT COUNT(*) AS total FROM pedidos WHERE ${condicionFecha}
    `);
    res.json({ total: pedidosPeriodo.total });
  } catch (error) {
    console.error("Error en getPedidosStats:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// === Ventas ===
exports.getVentasStats = async (req, res) => {
  try {
    const periodo = req.query.periodo || "mes";
    const condicionFecha = getCondicionFecha(periodo);
    const [[ventasPeriodo]] = await db.promise().query(`
      SELECT IFNULL(SUM(total), 0) AS total FROM pedidos WHERE ${condicionFecha}
    `);
    res.json({ total: ventasPeriodo.total });
  } catch (error) {
    console.error("Error en getVentasStats:", error);
    res.status(500).json({ message: "Error al obtener ventas" });
  }
};

// === Productos más vendidos ===
exports.getProductosTop = async (req, res) => {
  try {
    const periodo = req.query.periodo || "mes";
    const condicionFecha = getCondicionFecha(periodo);
    const [productosTop] = await db.promise().query(`
      SELECT p.nombre, SUM(dp.cantidad) AS cantidad
      FROM detalle_pedido dp
      JOIN pedidos pe ON dp.pedido_id = pe.id
      JOIN productos p ON dp.producto_id = p.id
      WHERE ${condicionFecha}
      GROUP BY p.id
      ORDER BY cantidad DESC
      LIMIT 5
    `);
    res.json(productosTop);
  } catch (error) {
    console.error("Error en getProductosTop:", error);
    res.status(500).json({ message: "Error al obtener productos más vendidos" });
  }
};

// === Últimos usuarios ===
exports.getUsuariosRecientes = async (req, res) => {
  try {
    const [usuariosRecientes] = await db.promise().query(`
      SELECT id, nombre, email, rol, fecha_registro
      FROM usuarios
      ORDER BY fecha_registro DESC
      LIMIT 5
    `);
    res.json(usuariosRecientes);
  } catch (error) {
    console.error("Error en getUsuariosRecientes:", error);
    res.status(500).json({ message: "Error al obtener usuarios recientes" });
  }
};

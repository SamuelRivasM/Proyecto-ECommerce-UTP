
// backend/routes/pedidoRoutes.js
const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

// === Rutas para los pedidos del cliente ===
router.get("/cliente/:usuarioId", pedidoController.obtenerPedidosPorCliente);
router.get("/cliente/:pedidoId/detalle", pedidoController.obtenerDetallePedido);
router.post("/cliente/nuevo", pedidoController.crearPedido);
router.post("/cliente/verificar-stock", pedidoController.verificarStock);

//Rutas para la cocina.
router.get("/cocina/pedidos-ordenados", pedidoController.obtenerPedidosParaCocina);
router.put("/:pedidoId/actualizar-estado", pedidoController.actualizarEstadoPedido);

module.exports = router;
    
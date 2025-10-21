
// backend/routes/pedidoRoutes.js
const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

// === Rutas para los pedidos del cliente ===
router.get("/cliente/:usuarioId", pedidoController.obtenerPedidosPorCliente);
router.get("/cliente/:pedidoId/detalle", pedidoController.obtenerDetallePedido);
router.post("/cliente/nuevo", pedidoController.crearPedido);
router.post("/cliente/verificar-stock", pedidoController.verificarStock);

module.exports = router;

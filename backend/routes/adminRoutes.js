
// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Nuevas rutas independientes
router.get("/stats/usuarios", adminController.getUsuariosStats);
router.get("/stats/pedidos", adminController.getPedidosStats);
router.get("/stats/ventas", adminController.getVentasStats);
router.get("/stats/productos", adminController.getProductosTop);
router.get("/stats/usuarios-recientes", adminController.getUsuariosRecientes);

module.exports = router;

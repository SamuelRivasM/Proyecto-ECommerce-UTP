
// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

router.use(auth);

// Nuevas rutas independientes
router.get("/stats/usuarios", adminController.getUsuariosStats);
router.get("/stats/pedidos", adminController.getPedidosStats);
router.get("/stats/ventas", adminController.getVentasStats);
router.get("/stats/productos", adminController.getProductosTop);
router.get("/stats/usuarios-recientes", adminController.getUsuariosRecientes);
router.get("/cargar-usuarios", adminController.getUsuarios);
router.post("/crear-usuario", adminController.crearUsuario);
router.put("/editar-usuario/:id", adminController.editarUsuario);
router.patch("/estado-usuario/:id", adminController.cambiarEstadoUsuario);

module.exports = router;

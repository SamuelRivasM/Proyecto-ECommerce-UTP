
// backend/routes/productoRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productoController = require("../controllers/productoController");

// Configurar Multer para subir imágenes
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage });

// Rutas de productos
router.get("/cliente", productoController.obtenerProductosDisponibles);
router.get("/cocina", productoController.obtenerTodosProductos);
router.post("/upload/:id", upload.single("imagen"), productoController.actualizarImagenProducto);
router.get("/categorias", productoController.obtenerCategorias);
router.put("/cocina/:id", productoController.editarProducto);

module.exports = router;

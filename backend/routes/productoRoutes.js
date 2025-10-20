
// routes/productoRoutes.js
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
router.get("/disponibles", productoController.obtenerProductosDisponibles);
router.get("/todos", productoController.obtenerTodosProductos);
router.post(
    "/upload/:id",
    upload.single("imagen"),
    productoController.actualizarImagenProducto
);

module.exports = router;

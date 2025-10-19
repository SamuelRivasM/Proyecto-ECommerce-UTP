const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
    try {
        const query = `
      SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.precio, 
        p.imagen, 
        p.stock, 
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.disponible = 1
    `;
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error al obtener productos:", err);
                return res.status(500).json({ error: "Error al obtener productos" });
            }
            res.json(results);
        });
    } catch (err) {
        console.error("Error al procesar la solicitud:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;

const db = require('../models/db');

// Obtener todos los productos (con su categoría)
const obtenerProductos = (req, res) => {
    const query = `
    SELECT 
      p.id, 
      p.nombre, 
      p.descripcion, 
      p.precio, 
      p.imagen, 
      p.stock,
      p.disponible,
      c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.disponible = 1;
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
};

module.exports = { obtenerProductos };

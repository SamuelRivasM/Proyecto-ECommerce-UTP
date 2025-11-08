
// backend/controllers/productoController.js
const db = require("../models/db");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// === Obtener todos los productos disponibles (para Clientes) ===
exports.obtenerProductosDisponibles = async (req, res) => {
  try {
    const [productos] = await db.promise().query(`
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
    `);

    // No es necesario modificar la URL: ya es completa desde Cloudinary
    res.json(productos);
  } catch (error) {
    console.error("Error en obtenerProductos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// === Obtener todos los productos (para Cocina) ===
exports.obtenerTodosProductos = async (req, res) => {
  try {
    const [productos] = await db.promise().query(`
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
      ORDER BY p.id ASC
    `);
    res.json(productos);
  } catch (error) {
    console.error("Error en obtenerTodosProductos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// === Subir imagen y actualizar producto ===
exports.actualizarImagenProducto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ninguna imagen" });
    }

    const { id } = req.params;

    // Subir imagen a Cloudinary
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: "cafeteria_utp/img_productos",
      format: "avif",
    });

    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    // Actualizar imagen en la BD
    await db
      .promise()
      .query("UPDATE productos SET imagen = ? WHERE id = ?", [
        resultado.secure_url,
        id,
      ]);

    res.json({
      message: "Imagen actualizada correctamente",
      url: resultado.secure_url,
    });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({ message: "Error al subir imagen" });
  }
};

// === Obtener todas las categorías ===
exports.obtenerCategorias = async (req, res) => {
  try {
    const [categorias] = await db.promise().query(`
      SELECT id, nombre
      FROM categorias
      ORDER BY nombre ASC
    `);
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

// === Editar producto ===
exports.editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ message: "Nombre y precio son obligatorios" });
    }

    await db.promise().query(`
      UPDATE productos 
      SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?
      WHERE id = ?
    `, [nombre, descripcion, precio, stock, categoria_id || null, id]);

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).json({ message: "Error al editar producto" });
  }
};

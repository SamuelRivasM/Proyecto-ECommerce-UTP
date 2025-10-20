
// controllers/perfilController.js
const db = require("../models/db");
const bcrypt = require("bcryptjs");

// Obtener datos del usuario logueado
exports.getPerfil = async (req, res) => {
    try {
        const userId = req.user.id; // 👈 viene del token decodificado en tu middleware de auth

        const [[usuario]] = await db.promise().query(
            "SELECT id, nombre, email, telefono, rol, fecha_registro FROM usuarios WHERE id = ?",
            [userId]
        );

        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json(usuario);
    } catch (error) {
        console.error("Error en getPerfil:", error);
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

// Actualizar datos del usuario logueado
exports.updatePerfil = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nombre, telefono, password } = req.body;

        let hashedPassword = null;
        if (password && password.trim() !== "") {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Actualiza solo los campos editables
        const query = hashedPassword
            ? "UPDATE usuarios SET nombre = ?, telefono = ?, password = ? WHERE id = ?"
            : "UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?";

        const params = hashedPassword
            ? [nombre, telefono, hashedPassword, userId]
            : [nombre, telefono, userId];

        await db.promise().query(query, params);

        res.json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
        console.error("Error en updatePerfil:", error);
        res.status(500).json({ message: "Error al actualizar perfil" });
    }
};

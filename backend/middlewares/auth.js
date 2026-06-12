
// backend/middlewares/auth.js
const jwt = require("jsonwebtoken");
const db = require("../models/db");

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.promise().query(
      "SELECT id, estado, session_version FROM usuarios WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    if (user.estado === 0) {
      return res.status(403).json({ message: "Usuario desactivado" });
    }

    if (decoded.sessionVersion !== user.session_version) {
      return res.status(401).json({
        message: "Sesión expirada o cerrada desde otro navegador",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = auth;

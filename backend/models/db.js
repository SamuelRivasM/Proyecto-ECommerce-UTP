
// backend/models/db.js
const mysql = require("mysql2");
require("dotenv").config();

// Crear pool de conexiones
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafeteria_utp",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// === Log para confirmar conexión y detectar errores ===
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar con la base de datos:");
    if (err.code === "ECONNREFUSED") console.error("→ Conexión rechazada. ¿MySQL está activo?");
    else if (err.code === "ER_ACCESS_DENIED_ERROR") console.error("→ Usuario o contraseña incorrectos.");
    else console.error(err);
  } else {
    console.log("Conexión a la base de datos establecida correctamente.");
    connection.release();
  }
});

module.exports = db;

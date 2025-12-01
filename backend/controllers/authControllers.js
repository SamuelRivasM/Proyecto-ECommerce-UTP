
// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// === LOGIN ===
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `
      SELECT id, nombre, email, password, rol, estado 
      FROM usuarios
      WHERE email = ?
    `;

    const [users] = await db.promise().query(query, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Validar estado del usuario
    if (user.estado === 0) {
      return res.status(403).json({ message: 'Usuario desactivado. Comuníquese con Administración.' });
    }

    const isMatch = await bcrypt.compare(password, user.password.toString());
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Actualizar último login
    await db.promise().query(
      "UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?",
      [user.id]
    );

    // Generar token
    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol,
        nombre: user.nombre,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: `Bienvenido ${user.nombre}`,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        ultimo_login: new Date()
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// === REGISTER ===
exports.register = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    if (!nombre || !email || !telefono || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe un usuario con ese email
    const checkQuery = `SELECT id FROM usuarios WHERE email = ?`;
    const [existing] = await db.promise().query(checkQuery, [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar usuario en la BD (rol = cliente por defecto)
    const insertQuery = `
      INSERT INTO usuarios (nombre, email, telefono, password, rol)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [nombre, email, telefono, hashedPassword, 'cliente'];

    const [result] = await db.promise().query(insertQuery, values);

    // Generar token
    const token = jwt.sign(
      { id: result.insertId, rol: 'cliente', nombre, email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.insertId,
        nombre,
        email,
        telefono,
        rol: 'cliente',
        fecha_registro: new Date() // opcional: puedes mostrarlo directamente
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const crypto = require("crypto");
const { Resend } = require("resend");
const twilio = require("twilio");

// === FORGOT PASSWORD ===
exports.forgotPassword = async (req, res) => {
  try {
    const { method, value } = req.body;

    // Buscar usuario
    const query = `SELECT id, nombre, email, telefono FROM usuarios WHERE ${method} = ?`;
    const [users] = await db.promise().query(query, [value]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = users[0];

    // Generar token
    const token = crypto.randomBytes(32).toString("hex");

    await db.promise().query(
      "INSERT INTO tokens_recuperacion (usuario_id, token) VALUES (?, ?)",
      [user.id, token]
    );

    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

    // Envío de Correo Resend
    if (method === "email") {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Recuperación de contraseña",
        html: `
          <p>Hola ${user.nombre},</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `,
      });

    } if (method === "telefono") {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      // Validación de que esté habilitado el teléfono de Twilio
      if (!process.env.TWILIO_PHONE) {
        return res.status(503).json({ message: "La opción por teléfono aún no está habilitada" });
      }

      await client.messages.create({
        body: `Tu código de recuperación es: ${token}`,
        from: process.env.TWILIO_PHONE,
        to: user.telefono, // asegúrate que el número está en formato internacional (+51 para Perú)
      });
    }

    res.json({ message: "Se envió el enlace/código de recuperación" });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// === RESET PASSWORD ===
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Buscar token
    const [rows] = await db
      .promise()
      .query(
        "SELECT usuario_id FROM tokens_recuperacion WHERE token = ? AND usado = 0",
        [token]
      );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o usado" });
    }

    const usuarioId = rows[0].usuario_id;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    await db
      .promise()
      .query("UPDATE usuarios SET password = ? WHERE id = ?", [
        hashedPassword,
        usuarioId,
      ]);

    // Marcar token como usado
    await db
      .promise()
      .query("UPDATE tokens_recuperacion SET usado = 1 WHERE token = ?", [
        token,
      ]);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

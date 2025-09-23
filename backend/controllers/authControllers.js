
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// === LOGIN ===
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `
      SELECT id, nombre, email, password, rol 
      FROM usuarios
      WHERE email = ?
    `;

    const [users] = await db.promise().query(query, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password.toString());

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

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

    // Respuesta al frontend
    res.json({
      message: `Bienvenido ${user.nombre}`,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
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

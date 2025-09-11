
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

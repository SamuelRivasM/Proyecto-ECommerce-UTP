
// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const productoRoutes = require("./routes/productoRoutes");

const app = express();
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Range'],
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Range']
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);         // Autenticación
app.use("/api/perfil", perfilRoutes);     // Configuración de Perfil Global
app.use("/api/admin", adminRoutes);       // Funciones Admin
app.use('/api/productos', productoRoutes); // Catalogo

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});


// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require("./routes/adminRoutes");
const perfilRoutes = require("./routes/perfilRoutes");
const productoRoutes = require("./routes/productoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'https://proyecto-ecommerce-utp.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Range'],
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Range']
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use("/api/perfil", perfilRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/productos', productoRoutes);
app.use("/api/pedidos", pedidoRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Socket.IO init
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'https://proyecto-ecommerce-utp.onrender.com'],
    methods: ["GET", "POST"],
  },
});

// Guarda socket IO accesible globalmente
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado vía Socket.IO:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));

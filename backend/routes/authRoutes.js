
// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const auth = require("../middlewares/auth");

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", auth, authController.logout);
router.get("/me", auth, authController.me);

module.exports = router;

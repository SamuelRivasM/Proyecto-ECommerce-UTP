
// backend/routes/perfilRoutes.js
const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perfilController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, perfilController.getPerfil);
router.put("/", authMiddleware, perfilController.updatePerfil);

module.exports = router;

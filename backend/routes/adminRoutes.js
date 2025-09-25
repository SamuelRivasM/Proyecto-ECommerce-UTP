
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Dashboard
router.get("/stats", adminController.getStats);

module.exports = router;

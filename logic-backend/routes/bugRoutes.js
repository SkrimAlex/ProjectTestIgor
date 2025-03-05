const express = require("express");
const router = express.Router();
const { createBug } = require("../controllers/bugController");

// Додавання нового багу
router.post("/bugs", createBug);

module.exports = router;

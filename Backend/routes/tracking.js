const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

// Курьер отправляет свои координаты
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "courier") return res.status(403).json({ msg: "Только курьер может отправлять геопозицию" });

  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ msg: "Координаты обязательны" });

  // Можно сохранять координаты в БД или Redis для трекинга
  console.log(`Курьер ${req.user.id} координаты: ${lat}, ${lng}`);

  res.json({ msg: "Геопозиция получена" });
});

module.exports = router;

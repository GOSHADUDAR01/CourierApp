const express = require("express");
const User = require("../models/User");
// const auth = require("../middleware/auth"); // закомментировать

const router = express.Router();

// Получение всех курьеров
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: "courier" }).select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
});

module.exports = router;





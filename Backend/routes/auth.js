const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Логин (можно оставить для других целей)
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Пользователь не найден" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ msg: "Неверный пароль" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET || "refreshSecret123",
        { expiresIn: "7d" }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.json({ token, refreshToken, user: { email: user.email, role: user.role } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Ошибка сервера" });
    }
  }
);

// Обновление токена
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ msg: "Нет refresh токена" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refreshSecret123");
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: "Неверный refresh токен" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "15m" }
    );

    res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(403).json({ msg: "refresh токен недействителен" });
  }
});

// Эндпоинт для автоматической генерации токенов админа
router.get("/initAdminTokens", async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) return res.status(404).json({ msg: "Admin не найден" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "secret123", { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_REFRESH_SECRET || "refreshSecret123", { expiresIn: "7d" });

    admin.refreshToken = refreshToken;
    await admin.save();

    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ msg: "Ошибка сервера" });
  }
});

module.exports = router;

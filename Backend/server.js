const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"], // фронтенд админки
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// Подключаем роуты
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

// Защищённый маршрут для проверки
const authMiddleware = require("./middleware/auth");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ msg: `Привет, пользователь ${req.user.id}, доступ разрешён!` });
});

// Подключение к MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/d_p", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB подключен");

    // Автоматическая инициализация токенов админа при старте сервера
    const User = require("./models/User");
    const jwt = require("jsonwebtoken");

    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_REFRESH_SECRET || "refreshSecret123",
        { expiresIn: "7d" }
      );

      admin.refreshToken = refreshToken;
      await admin.save();

      console.log("Токены админа сгенерированы автоматически");
      console.log("Access token:", token);
      console.log("Refresh token:", refreshToken);
    } else {
      console.log("Admin не найден, создайте пользователя с ролью 'admin' в базе");
    }
  })
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





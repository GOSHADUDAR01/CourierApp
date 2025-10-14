const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // формат: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "Нет токена, доступ запрещён" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Токен истёк" });
      }
      return res.status(401).json({ msg: "Неверный токен" });
    }

    req.user = decoded; // { id, role, iat, exp }
    next();
  });
};

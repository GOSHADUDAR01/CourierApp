const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// ===== Получение всех заказов =====
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("courier", "email");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
});

// ===== Создание нового заказа =====
router.post("/", async (req, res) => {
  try {
    const order = new Order({
      address: req.body.address,
      items: req.body.items,
      courier: req.user.id
    });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера" });
  }
});

// ===== Обновление статуса заказа =====
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Заказ не найден" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Ошибка сервера при обновлении заказа" });
  }
});

module.exports = router;


const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  address: { type: String, required: true },
  items: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ["pending", "assigned", "delivering", "delivered"],
    default: "pending"
  },
  courier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Order", OrderSchema);


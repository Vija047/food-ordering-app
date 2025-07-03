const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow orders without user authentication for now
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  items: [
    {
      _id: String,
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      restaurant: String,
      category: String,
      image: String,
      note: String,
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  packagingFee: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    type: String,
    description: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  customerEmail: {
    type: String,
    required: false,
  },
  customerPhone: {
    type: String,
    required: false,
  },
  estimatedDeliveryTime: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 40 * 60 * 1000); // 40 minutes from now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

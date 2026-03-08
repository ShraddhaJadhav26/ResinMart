const express = require("express");
const router = express.Router();
const Order = require("../Models/order");
const Product = require("../Models/Product");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("product");

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching orders",
      error: err.message
    });
  }
});

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("product");

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching orders",
      error: err.message
    });
  }
});
router.post("/", auth, async (req, res) => {
  try {
    const { items, phone, address, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: req.user.id,
      items,
      phone,
      address,
      totalAmount
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    res.status(500).json({
      message: "Error placing order",
      error: err.message
    });
  }
});

router.patch("/:id/payment", auth, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Paid" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Payment status updated",
      order: updatedOrder
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating payment",
      error: err.message
    });
  }
});
module.exports = router;
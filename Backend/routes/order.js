const express = require("express");
const router = express.Router();
const Order = require("../Models/order");
const auth = require("../middleware/auth");

// 1. Get All Orders (Admin View)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// 2. Get Logged-in User's Orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your orders", error: err.message });
  }
});

// 3. Place a New Order
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
      // orderStatus will default to "Processing" based on your Schema
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
});

// 4. Update Payment Status (Admin)
router.patch("/:id/payment", auth, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Paid" },
      { new: true }
    );
    res.json({ message: "Payment updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// 5. Update Tracking Status (Admin) - NEW ROUTE
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { orderStatus } = req.body; // Expecting "Shipped", "On the way", etc.
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
});

// Get a specific order by ID (needed for the Review page)
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
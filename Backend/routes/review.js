const express = require("express");
const router = express.Router();
const Review = require("../Models/Review");
const Order = require("../Models/order"); // 1. ADD THIS LINE
const auth = require("../middleware/auth");

// POST: Save a new review
router.post("/", auth, async (req, res) => {
  try {
    const { orderId, productId, rating, comment } = req.body;
    
    // Check if productId exists before saving
    if(!productId) {
        return res.status(400).json({ message: "Product ID is required from frontend" });
    }

    const review = new Review({
      order: orderId,    // Maps orderId from body to 'order' in Schema
      product: productId, // Maps productId from body to 'product' in Schema
      user: req.user.id,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: "Review saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch order details for the Review Page
// This fixes the "Unexpected token <" error on the frontend
router.get("/order/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: Fetch all reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    // We find reviews by productId and "fill in" the user's name
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "username") 
      .sort({ createdAt: -1 }); // Newest first

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
});

module.exports = router;
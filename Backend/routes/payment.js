const express = require("express");
const router = express.Router();

// MOCK: Create Order (Simulates Razorpay)
router.post("/create-order", async (req, res) => {
  try {
    const { amount, items } = req.body;

    // We generate a fake ID that looks like a Razorpay ID
    const mockOrder = {
      id: "order_MOCK_" + Math.random().toString(36).substring(2, 11),
      amount: amount * 100, // Still use paise for consistency
      currency: "INR",
      status: "created"
    };

    console.log(`Successfully created Mock Order: ${mockOrder.id}`);
    res.json(mockOrder); 
  } catch (err) {
    res.status(500).json({ message: "Mock Payment Failed" });
  }
});

module.exports = router;
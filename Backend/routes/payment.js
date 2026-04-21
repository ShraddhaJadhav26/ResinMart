const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto"); // Built-in Node tool for security

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. REAL: Create Razorpay Order
router.post("/order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).send(error);
  }
});

// 2. REAL: Verify Payment (The Security Check)
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create the expected signature using your Secret Key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // ✅ SUCCESS: Payment is authentic!
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      // ❌ FAILED: Signature mismatch
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error during verification" });
  }
});

// 3. MOCK: Create Order (Keep for testing without keys)
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const mockOrder = {
      id: "order_MOCK_" + Math.random().toString(36).substring(2, 11),
      amount: amount * 100,
      currency: "INR",
      status: "created"
    };
    res.json(mockOrder); 
  } catch (err) {
    res.status(500).json({ message: "Mock Payment Failed" });
  }
});

module.exports = router;
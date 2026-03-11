const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true // Everyone is verified by default now!
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: "Registration successful! You can now log in." 
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      message: "Login successful", 
      token, 
      role: user.role,
      user: {
        name: user.name,
        email: user.email,
        address: user.address || ""
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// --- UPDATE ADDRESS ROUTE ---
router.put("/update-address", async (req, res) => {
  try {
    const { email, address } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: email }, 
      { address: address }, 
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      role: updatedUser.role
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating address", error: err.message });
  }
});

module.exports = router;
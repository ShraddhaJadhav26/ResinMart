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
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role:"user"
    });

    const savedUser = await newUser.save();

   const token = jwt.sign(
  { id: savedUser._id },
  "yourSecretKey",
  { expiresIn: "1d" }
);

res.status(201).json({
  message: "User registered successfully",
  token,
  role: savedUser.role
});




  } catch (err) {
    res.status(500).json({
      message: "Error registering user",
      error: err.message
    });
  }
});






// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      "yourSecretKey",
      { expiresIn: "1d" }
    );

    res.json({
  message: "Login successful",
  token,
  role: user.role
});

  } catch (err) {
    res.status(500).json({
      message: "Error logging in",
      error: err.message
    });
  }
});
module.exports = router;
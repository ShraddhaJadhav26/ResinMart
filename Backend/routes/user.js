const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Built-in Node tool
// const sendEmail = require("../utils/sendEmail");

// Register User
// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken // Save the token
    });

    await newUser.save();

    // Send the email link
    const url = `${process.env.BACKEND_URL}/users/verify/${verificationToken}`;
    const emailTemplate = `
      <h3>Welcome to ResinMart!</h3>
      <p>Please click the link below to verify your account:</p>
      <a href="${url}">Verify Email</a>
    `;
    
    //await sendEmail(newUser.email, "Verify your ResinMart Account", emailTemplate);

    // ONLY CHANGE: Removed token and role to prevent auto-login
    res.status(201).json({ 
      success: true, 
      message: "Registration successful! Please check your email to verify your account." 
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// NEW: Verify Route
// NEW: Verify Route (Force Update Version)
router.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    // Use findOneAndUpdate to change status and remove token in one atomic step
    const user = await User.findOneAndUpdate(
      { verificationToken: token },
      { 
        $set: { isVerified: true }, 
        $unset: { verificationToken: "" } // Removes the token field entirely
      },
      { new: true } // Returns the updated document
    );

    if (!user) {
      // Check if user is already verified (this is why findOneAndUpdate might fail)
      return res.send(`
        <div style="text-align:center; padding:50px; font-family: sans-serif;">
          <h1 style="color: #6c5ce7;">Account Active</h1>
          <p>Your email is already verified or the link has expired.</p>
          <a href="${process.env.FRONTEND_URL}/login" style="text-decoration:none; color:white; background:#6c5ce7; padding:10px 20px; border-radius:5px;">Go to Login</a>
        </div>
      `);
    }

    // Redirect to your React Success Page
    res.redirect(`${process.env.FRONTEND_URL}/verify-success`);

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).send("Verification failed due to a server error.");
  }
});

// routes/user.js

// NEW: Resend Verification Email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

    // Generate a new token
    const newToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = newToken;
    await user.save();

    const url = `${process.env.BACKEND_URL}/users/verify/${newToken}`;
    const emailTemplate = `<h3>New Verification Link</h3><p>Click below:</p><a href="${url}">Verify Email</a>`;
    
    await sendEmail(user.email, "New Verification Link - ResinMart", emailTemplate);

    res.json({ message: "A new verification link has been sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Error resending email", error: err.message });
  }
});





// --- CLEANED LOGIN ROUTE (ONLY ONE VERSION) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // This is the essential part that sends data to your Profile page
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
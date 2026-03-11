const express = require("express");
const router = express.Router();
// const multer = require("multer"); <-- REMOVED: No longer needed here
// const path = require("path");   <-- REMOVED: No longer needed here
const Product = require("../Models/Product");
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require('../cloudinaryConfig'); // Use the Cloudinary config instead

// --- PUBLIC ROUTES ---

// GET: All products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// GET: Single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- ADMIN PROTECTED ROUTES ---

// POST: Add Product (Cloudinary Integration)
// ... (rest of the file imports remain the same)

// POST: Add Product (Updated to save Category)
router.post("/", auth, adminMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body; // Added category here
    const newProduct = new Product({
      title,
      description,
      price,
      category, // Saved to MongoDB
      image: req.file ? req.file.path : null 
    });
    await newProduct.save();
    res.status(201).json({ message: "Product created on Cloudinary!", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
});

// ... (rest of the file remains the same)

// PUT: Edit Product
router.put("/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Updated successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// DELETE: Delete Product
router.delete("/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;
const express=require("express");
const router=express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../Models/Product");
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message
    });
  }
});

router.post(
  "/",
  auth,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {


        console.log("FILE:", req.file);
        console.log("BODY:", req.body);
        const { title, description, price } = req.body;

        const newProduct = new Product({
            title,
            description,
            price,
            image: req.file ? req.file.filename : null
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch (err) {
        res.status(500).json({
            message: "Error creating product",
            error: err.message
        });
    }
});

router.get("/all", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching products",
            error: err.message
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching product",
            error: err.message
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct
        });

    } catch (err) {
        res.status(500).json({
            message: "Error deleting product",
            error: err.message
        });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating product",
            error: err.message
        });
    }
});


router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    // Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports=router;
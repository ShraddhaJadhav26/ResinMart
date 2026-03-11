const express = require("express");
const router = express.Router();

const Cart = require("../Models/Cart");
const authMiddleware = require("../middleware/auth");


router.post("/add", authMiddleware, async (req, res) => {
  try {

    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [{ product: productId }]
      });
    } else {

      const productIndex = cart.products.findIndex(
        p => p.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId });
      }

    }

    await cart.save();

    res.json({ message: "Product added to cart", cart });

  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("products.product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user._id });

if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== req.params.productId
    );

    await cart.save();

    res.json({ message: "Product removed from cart" });

  } catch (error) {
    res.status(500).json({ message: "Error removing product" });
  }
});
module.exports = router;

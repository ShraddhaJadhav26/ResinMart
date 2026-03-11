const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Add this line so we can show reviews on the Product page
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
require('dotenv').config(); // 🔥 MUST BE FIRST
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// 🔥 SECURE CORS: Moved up and cleaned
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Added PATCH for AdminOrders
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
const productroute = require("./routes/product.js");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const reviewRoutes = require("./routes/review");
const paymentRoutes = require("./routes/payment");

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/carts", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/products", productroute);

// 🔥 DATABASE CONNECTION: Using .env variable
const Mongo_Url = process.env.MONGODB_URI; 

async function main() {
  await mongoose.connect(Mongo_Url);
}

main()
  .then(() => console.log("Connected to MongoDB Atlas! ✅"))
  .catch((err) => console.log("DB Connection Error: ", err));

app.get("/", (req, res) => {
  res.send("ResinMart API is running...");
});

// 🔥 PORT: Using .env variable
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
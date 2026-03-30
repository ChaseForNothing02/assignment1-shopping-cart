const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running");
});
//get product
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});
//post a new product
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("POST /products error:", error);
    res.status(400).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});
//get post put delete cart feature
app.get("/cart", async (req, res) => {
  try {
    const items = await Cart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});
app.post("/cart", async (req, res) => {
  try {
    const existing = await Cart.findOne({ productId: req.body.productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const newItem = new Cart({ ...req.body, quantity: 1 });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
});
app.put("/cart/:id", async (req, res) => {
  try {
    const item = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart" });
  }
});
app.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/shopping-cart")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
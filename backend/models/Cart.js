const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  image: String,
  category: String,
  quantity: Number,
});

module.exports = mongoose.model("Cart", cartSchema);
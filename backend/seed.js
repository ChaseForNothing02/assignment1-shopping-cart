const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Mouse",
    price: 25,
    image: "🖱️",
    category: "Accessories",
  },
  {
    name: "Wireless Earbuds",
    price: 65,
    image: "🎧",
    category: "Audio",
  },
  {
    name: "Speaker",
    price: 95,
    image: "🔊",
    category: "Audio",
  },
  {
    name: "Desk Organizer",
    price: 22,
    image: "🗂️",
    category: "Office",
  },
  {
    name: "Portable SSD",
    price: 140,
    image: "💾",
    category: "Accessories",
  },
  {
    name: "Gaming Headset",
    price: 120,
    image: "🎮",
    category: "Gaming",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products seeded!");

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error(error);
  });
const express = require("express");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
});

router.get("/carts", protect, adminOnly, async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    const groupedCarts = carts.reduce((result, item) => {
      const userKey = item.userId?._id?.toString() || "unknown";

      if (!result[userKey]) {
        result[userKey] = {
          user: item.userId,
          items: [],
          totalPrice: 0,
          totalItems: 0,
        };
      }

      result[userKey].items.push(item);
      result[userKey].totalPrice += item.price * item.quantity;
      result[userKey].totalItems += item.quantity;

      return result;
    }, {});

    res.json(Object.values(groupedCarts));
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all carts.",
      error: error.message,
    });
  }
});

module.exports = router;
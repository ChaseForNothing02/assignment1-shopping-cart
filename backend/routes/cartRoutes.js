const express = require("express");

const Cart = require("../models/Cart");

const Product = require("../models/Product");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart.",
      error: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const {
      productId,
      adminUserId,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        message:
          "Product ID is required.",
      });
    }

    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    let targetUserId = req.user._id;

    if (
      req.user.role === "admin" &&
      adminUserId
    ) {
      targetUserId = adminUserId;
    }

    const existingItem =
      await Cart.findOne({
        userId: targetUserId,
        productId: product._id,
      });

    if (existingItem) {
      existingItem.quantity += 1;

      await existingItem.save();

      return res.json(existingItem);
    }

    const cartItem = await Cart.create({
      userId: targetUserId,

      productId: product._id,

      name: product.name,

      price: product.price,

      image: product.image,

      category: product.category,

      quantity: 1,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to add item to cart.",

      error: error.message,
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message:
          "Quantity must be at least 1.",
      });
    }

    const cartItem =
      await Cart.findOneAndUpdate(
        {
          _id: req.params.id,

          userId: req.user._id,
        },

        {
          quantity,
        },

        {
          new: true,

          runValidators: true,
        }
      );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found.",
      });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update cart item.",

      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const cartItem =
      await Cart.findOneAndDelete({
        _id: req.params.id,

        userId: req.user._id,
      });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found.",
      });
    }

    res.json({
      message: "Cart item deleted.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to delete cart item.",

      error: error.message,
    });
  }
});

router.delete("/", protect, async (req, res) => {
  try {
    await Cart.deleteMany({
      userId: req.user._id,
    });

    res.json({
      message: "Cart cleared.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart.",

      error: error.message,
    });
  }
});

module.exports = router;
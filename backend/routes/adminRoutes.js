const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User");
const Property = require("../models/Property");
const Message = require("../models/Message");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ADMIN DASHBOARD STATISTICS
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalMessages,
      unreadMessages,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: "unread" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProperties,
        totalMessages,
        unreadMessages,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard statistics.",
    });
  }
});

// GET ALL REGISTERED USERS
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve users.",
    });
  }
});

// GET ALL CONTACT MESSAGES
router.get("/messages", protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount: messages.filter(
        (message) => message.status === "unread"
      ).length,
      data: messages,
    });
  } catch (error) {
    console.error("Get admin messages error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve messages.",
    });
  }
});

// MARK MESSAGE AS READ
router.patch(
  "/messages/:id/read",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID.",
        });
      }

      const message = await Message.findByIdAndUpdate(
        id,
        { status: "read" },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Message marked as read.",
        data: message,
      });
    } catch (error) {
      console.error("Mark message as read error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to update message status.",
      });
    }
  }
);

// MARK MESSAGE AS UNREAD
router.patch(
  "/messages/:id/unread",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID.",
        });
      }

      const message = await Message.findByIdAndUpdate(
        id,
        { status: "unread" },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Message marked as unread.",
        data: message,
      });
    } catch (error) {
      console.error("Mark message as unread error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to update message status.",
      });
    }
  }
);

// DELETE CONTACT MESSAGE
router.delete(
  "/messages/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID.",
        });
      }

      const message = await Message.findByIdAndDelete(id);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Message deleted successfully.",
        data: { id: message._id },
      });
    } catch (error) {
      console.error("Delete contact message error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to delete message.",
      });
    }
  }
);

module.exports = router;
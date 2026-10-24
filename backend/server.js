const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Property = require("./models/Property");
const Message = require("./models/Message");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const {
  protect,
  adminOnly,
} = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// General Middleware
app.use(express.json({ limit: "20kb" }));

// Authentication Routes
app.use("/api/auth", authRoutes);

// Protected Admin Routes
app.use("/api/admin", adminRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Havenly Backend is Running!");
});

// API Test Route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Havenly API!",
  });
});

// API Test Route
app.get("/api/test-put", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API routes are ready!",
  });
});

// GET ALL PROPERTIES
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Fetch properties error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
});

// GET SINGLE PROPERTY
app.get("/api/properties/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID.",
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Fetch property error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch property.",
    });
  }
});

// CREATE PROPERTY - ADMIN ONLY
app.post(
  "/api/properties",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const property = await Property.create(req.body);

      res.status(201).json({
        success: true,
        message: "Property created successfully.",
        data: property,
      });
    } catch (error) {
      console.error("Create property error:", error);

      res.status(400).json({
        success: false,
        message:
          error.message || "Failed to create property.",
      });
    }
  }
);

// UPDATE PROPERTY - ADMIN ONLY
app.put(
  "/api/properties/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID.",
        });
      }

      const property = await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Property updated successfully.",
        data: property,
      });
    } catch (error) {
      console.error("Update property error:", error);

      res.status(400).json({
        success: false,
        message:
          error.message || "Failed to update property.",
      });
    }
  }
);

// DELETE PROPERTY - ADMIN ONLY
app.delete(
  "/api/properties/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID.",
        });
      }

      const property = await Property.findByIdAndDelete(
        req.params.id
      );

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Property deleted successfully.",
        data: property,
      });
    } catch (error) {
      console.error("Delete property error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete property.",
      });
    }
  }
);

// SUBMIT CONTACT MESSAGE
app.post("/api/messages", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      subject.trim().length > 200 ||
      message.trim().length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "One or more fields exceed the allowed length.",
      });
    }

    const savedMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully.",
      data: {
        id: savedMessage._id,
        createdAt: savedMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit contact message error:", error);

    res.status(500).json({
      success: false,
      message:
        "Failed to submit your message. Please try again.",
    });
  }
});

// DATABASE CONNECTION AND SERVER START
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/havenly_db"
  )
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `Havenly Backend running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });
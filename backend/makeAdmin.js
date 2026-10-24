require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const makeAdmin = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/havenly_db";

    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      throw new Error(
        "ADMIN_EMAIL is missing from the .env file."
      );
    }

    await mongoose.connect(mongoURI);

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      throw new Error(
        "Account not found. Register this account first."
      );
    }

    user.role = "admin";
    await user.save();

    console.log("Admin account created successfully!");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

makeAdmin();
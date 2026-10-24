const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
require("dotenv").config();

const Property = require("./models/Property");

const properties = [
  {
    title: "Modern Family House",
    location: "DHA Phase 6, Lahore",
    city: "Lahore",
    propertyType: "House",
    price: 85000,
    bedrooms: 4,
    bathrooms: 4,
    area: 2500,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    description:
      "A beautifully designed family home with spacious rooms, modern finishing and a peaceful neighborhood.",
  },
  {
    title: "Luxury Apartment",
    location: "Gulberg III, Lahore",
    city: "Lahore",
    propertyType: "Apartment",
    price: 65000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1450,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    description:
      "Modern apartment in a prime location with stylish interiors and excellent access to restaurants and shopping.",
  },
  {
    title: "Elegant Family Villa",
    location: "Bahria Town, Islamabad",
    city: "Islamabad",
    propertyType: "Villa",
    price: 120000,
    bedrooms: 5,
    bathrooms: 5,
    area: 3500,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    description:
      "Spacious luxury villa offering modern living, large bedrooms, beautiful outdoor space and premium finishes.",
  },
  {
    title: "Contemporary City Apartment",
    location: "Clifton, Karachi",
    city: "Karachi",
    propertyType: "Apartment",
    price: 95000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1900,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    description:
      "Contemporary apartment with bright interiors, comfortable bedrooms and convenient city access.",
  },
  {
    title: "Spacious Residential House",
    location: "Model Town, Lahore",
    city: "Lahore",
    propertyType: "House",
    price: 70000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    description:
      "Comfortable residential house with spacious living areas and a quiet family-friendly environment.",
  },
  {
    title: "Premium Modern Home",
    location: "F-11, Islamabad",
    city: "Islamabad",
    propertyType: "House",
    price: 110000,
    bedrooms: 4,
    bathrooms: 4,
    area: 3000,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    description:
      "Premium home featuring modern architecture, generous living spaces and a highly desirable location.",
  },
];

async function seedProperties() {
  try {
    const mongoUri =
      process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MongoDB connection string .env file mein nahi mili.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully!");

    // Existing properties ko duplicate hone se bachao.
    const existingTitles = await Property.distinct("title");

    const newProperties = properties.filter(
      (property) => !existingTitles.includes(property.title)
    );

    if (newProperties.length === 0) {
      console.log("All 6 properties pehle se database mein mojood hain.");
      return;
    }

    await Property.insertMany(newProperties);

    console.log(`${newProperties.length} properties successfully saved!`);

    const total = await Property.countDocuments();
    console.log(`Database mein total properties: ${total}`);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProperties();
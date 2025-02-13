const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Import path module
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parser

// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const userRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// Sample API Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.get("/register", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


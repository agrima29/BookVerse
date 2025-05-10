const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");



dotenv.config(); // Load .env before using variables

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book"); // 👈 Protected Book Routes
const reviewRoutes = require("./routes/review");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/review", reviewRoutes);
app.use(express.static(path.join(__dirname, "../public"))); // change 'public' to your frontend folder name

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    dbName: "bookverse", // 👈 Name of your MongoDB database
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("📚 BookVerse Server is running!");
});

// Routes
app.use("/api/auth", authRoutes);   // Authentication Routes
app.use("/api/books", bookRoutes); // Protected Book Routes

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
   .on("error", (err) => console.error("❌ Server Error:", err));

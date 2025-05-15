const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config(); // Load .env before using variables

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/bookRoutes"); // Book routes
const reviewRoutes = require("./routes/reviewRoutes"); // ✅ Rename to match your actual file name

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (HTML/CSS/JS) from public folder
app.use(express.static(path.join(__dirname, "../public")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "bookverse",
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("📚 BookVerse Server is running!");
});

// API Routes
app.use("/api/auth", authRoutes);     // Auth routes
app.use("/api/books", bookRoutes);    // Books routes
app.use("/api/review", reviewRoutes); // ✅ Reviews route

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
   .on("error", (err) => console.error("❌ Server Error:", err));

const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST /api/review - Create a new review
router.post("/", async (req, res) => {
    const { bookId, reviewerName, comment, rating } = req.body;

    try {
        const newReview = new Review({ bookId, reviewerName, comment, rating });
        await newReview.save();
        res.status(201).json({ success: true, message: "Review added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to add review" });
    }
});

// GET /api/review/:bookId - Get all reviews for a book
// GET: Fetch all reviews for a specific book
router.get("/book/:bookId", async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.find({ bookId });
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Failed to load reviews" });
    }
});


module.exports = router;

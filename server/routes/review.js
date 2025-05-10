const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Book = require("../models/Book");

// POST: Add a review to a book
router.post("/", protect, async (req, res) => {
    try {
        const { bookId, review } = req.body;

        console.log("Book ID:", bookId);
        console.log("Review:", review);
        console.log("User ID:", req.user._id); // Check if user is populated

        if (!bookId || !review) {
            return res.status(400).json({ message: "Please provide bookId and review." });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            console.log("Book not found.");
            return res.status(404).json({ message: "Book not found." });
        }

        const newReview = {
            user: req.user._id,
            review,
        };

        book.reviews.push(newReview);
        await book.save();

        res.status(201).json({ success: true, message: "Review added!", book });
    } catch (err) {
        console.error("Error in POST /api/review:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;

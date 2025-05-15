const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Book = require("../models/Book");

// Protected test route
router.get("/private", protect, (req, res) => {
    res.json({
        message: `Welcome, ${req.user.name}! This is a protected route.`,
        user: req.user
    });
});

// POST: Add new book
router.post("/", protect, async (req, res) => {
    try {
        const { title, author, description, amazon_link, genre } = req.body;

        const newBook = new Book({
            title,
            author,
            description,
            amazon_link,
            genre,
            createdBy: req.user.id
        });

        await newBook.save();

        res.status(201).json({
            success: true,
            message: "Book saved successfully!",
            book: newBook
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET: All books
router.get("/", protect, async (req, res) => {
    try {
        const books = await Book.find().populate("createdBy", "name email");
        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET: Books created by the logged-in user
router.get("/mybooks", protect, async (req, res) => {
    try {
        const books = await Book.find({ createdBy: req.user._id });
        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET: Books by genre (no auth required)
router.get("/genre/:genre", async (req, res) => {
    try {
        const genre = req.params.genre.toLowerCase();
        const books = await Book.find({ genre: genre });

        if (books.length === 0) {
            return res.status(404).json({ success: false, message: "No books found in this genre" });
        }

        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error("Error fetching books by genre:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE: A book by ID
router.delete("/:id", protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (book.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this book" });
        }

        await book.deleteOne();
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// GET: Get a single book by ID (with reviews)
router.get("/:id", protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("reviews.user", "name email");

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET: Real books by genre using Google Books API
router.get("/genre/:genre", async (req, res) => {
    try {
        const genre = req.params.genre;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=20`);

        const books = response.data.items.map(book => ({
            title: book.volumeInfo.title,
            author: (book.volumeInfo.authors || []).join(", "),
            description: book.volumeInfo.description || "No description available",
            image: book.volumeInfo.imageLinks?.thumbnail || "",
            rating: book.volumeInfo.averageRating || "No rating",
            amazon_link: `https://www.amazon.in/s?k=${encodeURIComponent(book.volumeInfo.title)}`
        }));

        res.status(200).json({ success: true, books });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ success: false, message: "Failed to fetch books from Google Books API" });
    }
});

module.exports = router;

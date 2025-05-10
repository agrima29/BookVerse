// controllers/bookController.js
const getBooks = async (req, res) => {
    try {
        // For now, return sample books (replace with DB later)
        const sampleBooks = [
            { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
            { id: 2, title: "1984", author: "George Orwell" },
        ];
        res.status(200).json({ success: true, books: sampleBooks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch books", error: error.message });
    }
};

module.exports = {
    getBooks,
};

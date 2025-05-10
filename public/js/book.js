document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view this page.");
        window.location.href = "/login.html"; // or wherever your login page is
        return;
    }

    // Fetch book by ID (Assuming a route like GET /api/books/:id exists)
    axios.get(`http://localhost:5000/api/books/${bookId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        const book = response.data.book;
        document.getElementById("book-title").innerText = book.title;
        document.getElementById("book-description").innerText = book.description || "No description";
        document.getElementById("author-name").innerText = book.author;
        document.getElementById("amazon-link").href = book.amazon_link || "#";
    })
    .catch(error => {
        console.error("❌ Error fetching book:", error);
        alert("Could not fetch book details.");
    });

    // Submit Review Handler
    document.getElementById("submit-review-btn").addEventListener("click", () => {
        const reviewText = document.getElementById("review-text").value;

        if (!reviewText) {
            alert("Please write a review.");
            return;
        }

        axios.post("http://localhost:5000/api/review", {
            bookId,
            review: reviewText
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(() => {
            alert("✅ Review submitted!");
            document.getElementById("review-text").value = "";
        })
        .catch(err => {
            console.error("❌ Failed to submit review:", err);
            alert("Failed to submit review.");
        });
    });
});

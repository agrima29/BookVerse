function loadBooks(genre) {
    fetch(`http://localhost:5000/books?genre=${genre}`)
        .then(response => response.json())
        .then(books => {
            let bookList = '<h3>Books:</h3>';
            books.forEach(book => {
                bookList += `<p><a href="book.html?id=${book.id}">${book.title}</a></p>`;
            });
            document.getElementById("genre-list").innerHTML += bookList;
        })
        .catch(error => console.error('Error:', error));
}

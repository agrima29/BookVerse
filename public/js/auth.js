const API_BASE = "http://localhost:5000"; // Change when deploying

// Helper function to make API requests
async function makeRequest(endpoint, method, body) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        return { success: false, message: "Something went wrong. Try again!" };
    }
}

// Handle Signup
document.getElementById("signup-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = await makeRequest("/auth/signup", "POST", { name, email, password });

    alert(data.message);
    if (data.success) window.location.href = "login.html"; // Redirect to login
});

// Handle Login
document.getElementById("login-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const data = await makeRequest("/auth/login", "POST", { email, password });

    alert(data.message);
    if (data.success) {
        localStorage.setItem("token", data.token); // Store JWT
        window.location.href = "index.html"; // Redirect to homepage
    }
});

// Handle Logout
document.getElementById("logout-btn")?.addEventListener("click", function () {
    localStorage.removeItem("token"); // Remove JWT token
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login page
});

// Function to check if user is logged in
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
    }
}

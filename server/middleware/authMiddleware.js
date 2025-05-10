// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (optional but useful)
        req.user = await User.findById(decoded.id).select("-password");

        next(); // Move to the next middleware/route handler
    } catch (error) {
        console.error("❌ JWT verification failed:", error.message);
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

module.exports = protect;

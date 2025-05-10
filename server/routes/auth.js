const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 📌 Helper function for standardized error responses
const sendErrorResponse = (res, status, message, error = null) => {
    console.error(`❌ ${message}`, error?.stack || "");
    res.status(status).json({
        success: false,
        message,
        error: error?.message || null,
    });
};

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return sendErrorResponse(res, 400, "All fields are required.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendErrorResponse(res, 400, "Invalid email format.");
        }

        if (password.length < 6) {
            return sendErrorResponse(res, 400, "Password must be at least 6 characters.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendErrorResponse(res, 409, "User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Use 12 rounds (better security)

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const payload = { id: newUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            success: true,
            message: "Signup successful!",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        return sendErrorResponse(res, 500, "Server Error", error);
    }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendErrorResponse(res, 400, "Email and password are required.");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, 401, "Invalid credentials.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 401, "Invalid credentials.");
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        return sendErrorResponse(res, 500, "Server Error", error);
    }
});

module.exports = router;

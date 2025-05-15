// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: { type: String, required: true }, // Can be Google volume.id or MongoDB _id
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);

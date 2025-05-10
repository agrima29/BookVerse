const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming your User model is named 'User'
    required: true,
  },
  review: {
    type: String,
    required: true,
  }
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [reviewSchema], // <--- THIS is the important part
});

module.exports = mongoose.model("Book", bookSchema);

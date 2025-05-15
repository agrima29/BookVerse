const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    author: {
      type: String,
      required: [true, "Author is required"]
    },
    description: {
      type: String
    },
    amazon_link: {
      type: String
    },
    genre: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reviews: [reviewSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Book", bookSchema);

const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Reference to User
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // ✅ Reference to Course
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewsSchema);

// backend/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },   // imdbID from OMDb
  reviewText: { type: String, required: true },
   trailerId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ⬇️ Explicitly collection "reviews" set kar diya
module.exports = mongoose.model('Review', reviewSchema, 'reviews');

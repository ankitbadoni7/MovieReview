// backend/models/comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // Google user ka unique ID
  userName: { type: String, required: true },     // User ka display name
  commentText: { type: String, required: true },  // User ka comment
  createdAt: { type: Date, default: Date.now }    // Timestamp
});

// Export the Comment model
module.exports = mongoose.model('Comment', commentSchema);

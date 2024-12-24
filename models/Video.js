const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  channel: String,
  approved: { type: Boolean, default: false },
  requestedBy: String,  // User who requested the video
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);

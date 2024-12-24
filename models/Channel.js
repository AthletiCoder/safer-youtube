const mongoose = require('mongoose');

// Channel Schema
const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  channelId: { type: String, required: true, unique: true },
  isWhitelisted: { type: Boolean, default: false },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Channel', channelSchema);

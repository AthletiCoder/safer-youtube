const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Fetch pending videos
router.get('/pending-videos', async (req, res) => {
  const pendingVideos = await Video.find({ approved: false });
  res.json(pendingVideos);
});

// Approve video
router.post('/approve-video', async (req, res) => {
  const { videoId } = req.body;
  await Video.updateOne({ videoId }, { approved: true });
  res.json({ message: 'Video Approved' });
});

const { verifyAdmin } = require('../middleware/authMiddleware');

// Protect admin routes
router.get('/pending-videos', verifyAdmin, async (req, res) => {
  const pendingVideos = await Video.find({ approved: false });
  res.json(pendingVideos);
});

router.post('/approve-video', verifyAdmin, async (req, res) => {
  const { videoId } = req.body;
  await Video.updateOne({ videoId }, { approved: true });
  res.json({ message: 'Video Approved' });
});

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Channel = require('../models/Channel');
const Video = require('../models/Video');
const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  
    const user = new User({ username, email, password: hashedPassword, isAdmin: False});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err });
    console.log(err)
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken(user);
    res.json({ token, user: { username: user.username } });
  } catch (err) {
    res.status(400).json({ message: 'Error logging in', error: err });
  }
});

// Channels
router.get('/channels', async (req, res) => {
  const channels = await Channel.find({ is_whitelisted: true });
  res.json(channels);
});

router.post('/channels/request', async (req, res) => {
  const { name, description } = req.body;
  const channel = new Channel({ name, description });
  await channel.save();
  res.json({ message: 'Request sent' });
});

// Videos
router.get('/videos', async (req, res) => {
  const videos = await Video.find({ is_whitelisted: true });
  res.json(videos);
});

router.post('/videos/request', async (req, res) => {
  const { title, url, channel_id } = req.body;
  const video = new Video({ title, url, channel_id });
  await video.save();
  res.json({ message: 'Video request sent' });
});


module.exports = router;

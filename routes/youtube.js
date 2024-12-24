const express = require('express');
const axios = require('axios');
const router = express.Router();

const YOUTUBE_API_KEY = 'AIzaSyBCOk38O5fU0AESHTgCcFpPTchGRKWfmF0';

// Search for channels or videos
router.get('/explore', async (req, res) => {
  const searchQuery = req.query.search;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=channel,video&key=${YOUTUBE_API_KEY}`
    );

    const results = response.data.items.map((item) => ({
      id: item.id.channelId || item.id.videoId,
      name: item.snippet.title,
      iconUrl: item.snippet.thumbnails.default.url,
      type: item.id.kind.includes('channel') ? 'channel' : 'video',
    }));

    res.json(results);
  } catch (error) {
    // console.error('Error fetching YouTube data:', error);
    res.status(500).json({ message: 'Failed to fetch data from YouTube' });
  }
});

// Fetch channel details
router.get('/channels/:id', async (req, res) => {
  const channelId = req.params.id;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    const channel = response.data.items[0];
    res.json({
      name: channel.snippet.title,
      iconUrl: channel.snippet.thumbnails.default.url,
    });
  } catch (error) {
    // console.error('Error fetching channel details:', error);
    res.status(500).json({ message: 'Failed to fetch channel details' });
  }
});

module.exports = router;
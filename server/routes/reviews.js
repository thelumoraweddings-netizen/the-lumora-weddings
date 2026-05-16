const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fallback reviews in case API key is not set or API fails
const fallbackReviews = [
  {
    author_name: "Eleanor & Thomas",
    rating: 5,
    text: "A truly breathtaking experience. The Lumora captured the essence of our wedding in a way we never thought possible. The cinematic approach is just on another level.",
    relative_time_description: "2 months ago",
    profile_photo_url: ""
  },
  {
    author_name: "Julian Vane",
    rating: 5,
    text: "Minimalism at its finest. The studio lighting and the attention to detail in post-production made my portraits look like they belonged in a high-end gallery.",
    relative_time_description: "4 months ago",
    profile_photo_url: ""
  },
  {
    author_name: "Sarah Jenkins",
    rating: 5,
    text: "The team was so patient with our kids and captured the most beautiful candid moments. These are photos we will treasure forever.",
    relative_time_description: "6 months ago",
    profile_photo_url: ""
  }
];

let cachedReviews = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

router.get('/', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // If no API key is provided, return the fallback reviews immediately
  if (!apiKey || !placeId) {
    return res.json({ success: true, source: 'fallback', reviews: fallbackReviews });
  }

  // Use cache if valid
  if (cachedReviews && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return res.json({ success: true, source: 'cache', reviews: cachedReviews });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`;
    const response = await axios.get(url);

    if (response.data.result && response.data.result.reviews) {
      cachedReviews = response.data.result.reviews;
      lastFetchTime = Date.now();
      return res.json({ success: true, source: 'google', reviews: cachedReviews });
    } else {
      return res.json({ success: true, source: 'fallback', reviews: fallbackReviews });
    }
  } catch (error) {
    console.error('Error fetching Google Reviews:', error.message);
    return res.json({ success: true, source: 'fallback', reviews: fallbackReviews, error: error.message });
  }
});

module.exports = router;

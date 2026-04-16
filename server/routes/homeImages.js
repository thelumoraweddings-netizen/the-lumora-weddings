const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Resolve the homepage_image directory relative to THIS file (server/routes/homeImages.js)
// server/routes/ → ../../client/public/images/homepage_image
const HOME_IMAGE_DIR = path.resolve(
  __dirname,
  '..', '..', 'client', 'public', 'images', 'homepage_image'
);

console.log('[home-images] Looking for images in:', HOME_IMAGE_DIR);

// GET /api/home-images — returns list of image URLs served from Vite's public folder
router.get('/', (req, res) => {
  try {
    // Create directory if it doesn't exist yet
    if (!fs.existsSync(HOME_IMAGE_DIR)) {
      fs.mkdirSync(HOME_IMAGE_DIR, { recursive: true });
      console.log('[home-images] Created directory:', HOME_IMAGE_DIR);
    }

    const validExtensions = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

    const files = fs.readdirSync(HOME_IMAGE_DIR)
      .filter(file => validExtensions.test(file))
      .sort(); // alphabetical order (prefix with 01_, 02_ to control order)

    const imageUrls = files.map(file => `/images/homepage_image/${file}`);

    console.log(`[home-images] Found ${files.length} image(s):`, files);

    res.json({ images: imageUrls, count: imageUrls.length });
  } catch (err) {
    console.error('[home-images] Error:', err.message);
    // Return empty array (not 500) so UI shows graceful empty state
    res.json({ images: [], count: 0, error: err.message });
  }
});

module.exports = router;

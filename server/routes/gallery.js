const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// @desc    Get all gallery images
// @route   GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload new image
// @route   POST /api/gallery
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    const newImage = new Gallery({
      title,
      category,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete image
// @route   DELETE /api/gallery/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
      await image.deleteOne();
      res.json({ message: 'Image removed' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const GalleryClient = require('../models/GalleryClient');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const EXACT_CATEGORIES = [
    { id: 'engagement', title: 'Engagement', description: 'The beautiful promise of a lifetime, captured in every glance.' },
    { id: 'wedding', title: 'Wedding / Reception', description: 'Cinematic storytelling of your most sacred union.' },
    { id: 'pre-post', title: 'Pre / Post Wedding', description: 'Natural light and breathtaking landscapes for your moments.' },
    { id: 'maternity-babyshower', title: 'Maternity / Baby Shower', description: 'Capturing the beautiful journey of motherhood.' },
    { id: 'baby-shoot', title: 'Baby Shoot', description: 'Capturing the joy of new beginnings and precious arrivals.' }
];

// @desc    Get all categories
router.get('/categories', (req, res) => {
    res.json(EXACT_CATEGORIES);
});

// @desc    Get clients by category
router.get('/categories/:categoryId/clients', async (req, res) => {
    try {
        const clients = await GalleryClient.find({ categoryId: req.params.categoryId }).sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get client by ID
router.get('/clients/:clientId', async (req, res) => {
    try {
        const client = await GalleryClient.findOne({ id: req.params.clientId });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Wrapper to catch multer errors
const uploadSingle = (field) => (req, res, next) => {
    upload.single(field)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: `Image upload failed: ${err.message}` });
        }
        next();
    });
};

const uploadArray = (field, maxCount) => (req, res, next) => {
    upload.array(field, maxCount)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: `Image upload failed: ${err.message}` });
        }
        next();
    });
};

// @desc    Create new client
router.post('/clients', protect, uploadSingle('coverImage'), async (req, res) => {
    try {
        const { categoryId, name, title, description, active } = req.body;
        const newClient = new GalleryClient({
            id: `client-${Date.now()}`,
            categoryId,
            name,
            title,
            description,
            active: active === 'true' || active === true,
            coverImage: req.file ? req.file.path : ''
        });
        const saved = await newClient.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update client
router.put('/clients/:clientId', protect, uploadSingle('coverImage'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.active !== undefined) {
            updateData.active = updateData.active === 'true' || updateData.active === true;
        }
        if (req.file) {
            updateData.coverImage = req.file.path;
        }
        const updated = await GalleryClient.findOneAndUpdate(
            { id: req.params.clientId },
            updateData,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete client
router.delete('/clients/:clientId', protect, async (req, res) => {
    try {
        await GalleryClient.findOneAndDelete({ id: req.params.clientId });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upload images to client
router.post('/clients/:clientId/images', protect, uploadArray('images', 20), async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        const updated = await GalleryClient.findOneAndUpdate(
            { id: req.params.clientId },
            { $push: { images: { $each: imageUrls } } },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete image from client
router.delete('/clients/:clientId/images', protect, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const updated = await GalleryClient.findOneAndUpdate(
            { id: req.params.clientId },
            { $pull: { images: imageUrl } },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

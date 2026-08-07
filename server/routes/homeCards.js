const express = require('express');
const router = express.Router();
const HomeCard = require('../models/HomeCard');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// Wrapper for single image upload
const uploadSingle = (field) => (req, res, next) => {
    upload.single(field)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: `Image upload failed: ${err.message}` });
        }
        next();
    });
};

// Wrapper for array image upload
const uploadArray = (field, maxCount) => (req, res, next) => {
    upload.array(field, maxCount)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: `Images upload failed: ${err.message}` });
        }
        next();
    });
};

// @desc    Get all home cards
router.get('/', async (req, res) => {
    try {
        let cards = await HomeCard.find().sort({ order: 1 });

        // Auto-seed the 4 default cards if the collection is empty
        if (cards.length === 0) {
            const defaultCards = [
                { 
                    id: 'homecard-default-1', img: '/images/homepage_image/image_1.jpg', cat: 'WEDDING', title: 'A Celebration of Love & Traditions', link: '/work/pollachi-wedding', order: 1,
                    innerTitle: 'Wedding — A Celebration of\nLove & Tradition',
                    innerDescription1: 'Some weddings feel like a beautiful story unfolding naturally. This enchanting celebration brought together two families and two cultures, creating moments filled with laughter, emotion, and heartfelt traditions.',
                    innerDescription2: 'For us, capturing this wedding was about more than pictures — it was about preserving emotions, laughter, and memories that the families will treasure forever.',
                    heroLeft: '/images/homepage_image/image_2.jpg',
                    heroCenter: '/images/homepage_image/image_1.jpg',
                    heroRight: '/images/homepage_image/image_3.jpg',
                    galleryImages: [
                        '/images/homepage_image/image_4.jpg', '/images/homepage_image/image_5.jpg', '/images/homepage_image/image_6.jpg', '/images/homepage_image/image_7.jpg',
                        '/images/homepage_image/image_8.jpg', '/images/homepage_image/image_1.jpg', '/images/homepage_image/image_2.jpg', '/images/homepage_image/image_3.jpg',
                        '/images/homepage_image/image_4.jpg', '/images/homepage_image/image_5.jpg', '/images/homepage_image/image_6.jpg', '/images/homepage_image/image_7.jpg'
                    ]
                },
                { 
                    id: 'homecard-default-2', img: '/images/homepage_image/image_2.jpg', cat: 'OUTDOOR COUPLE PHOTOGRAPHY', title: 'Moments of joy, laughter, and togetherness, framed under open skies.', link: '/work/outdoor-couple', order: 2,
                    innerTitle: 'Outdoor Couple Photography — \nMoments Framed Under Open Skies',
                    innerDescription1: 'There’s something magical about love when it’s framed by the natural world. This session brought us into the heart of the landscape, where the golden hour and the rustling breeze created the perfect canvas for emotion.',
                    innerDescription2: 'Capturing these moments was about more than just a background — it was about the connection between two souls in a space that feels as infinite as their journey.',
                    heroLeft: '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG07947.jpg',
                    heroCenter: '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08357.jpg',
                    heroRight: '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08378.jpg',
                    galleryImages: [
                        '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08392.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08409.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08422.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08434.jpg',
                        '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08448.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08490.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08504.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08551.jpg',
                        '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08572.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08596.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08620.jpg', '/images/OUTDOOR CC/DEVA SOWMIYA CC/IMG08688.jpg'
                    ]
                },
                { 
                    id: 'homecard-default-3', img: '/images/homepage_image/image_3.jpg', cat: 'BABYSHOWER — MATERNITY', title: 'Celebrating the miracle of life and the journey of motherhood.', link: '/work/maternity-story', order: 3,
                    innerTitle: 'Babyshower — Maternity — \nCelebrating the Miracle of Life',
                    innerDescription1: 'The journey to motherhood is one of the most beautiful and singular experiences in life. This story highlights the quiet grace and glowing anticipation of a family waiting for its newest member.',
                    innerDescription2: 'Capturing this moment was about preserving the radiance, the strength, and the overwhelming love that defines this very special time.',
                    heroLeft: '/images/MATERNITY CC/RIDHU CC/image_1.jpg',
                    heroCenter: '/images/MATERNITY CC/RIDHU CC/image_7.jpg',
                    heroRight: '/images/MATERNITY CC/RIDHU CC/image_17.jpg',
                    galleryImages: [
                        '/images/MATERNITY CC/RIDHU CC/image_2.jpg', '/images/MATERNITY CC/RIDHU CC/image_3.jpg', '/images/MATERNITY CC/RIDHU CC/image_4.jpg', '/images/MATERNITY CC/RIDHU CC/image_5.jpg',
                        '/images/MATERNITY CC/RIDHU CC/image_6.jpg', '/images/MATERNITY CC/RIDHU CC/image_8.jpg', '/images/MATERNITY CC/RIDHU CC/image_9.jpg', '/images/MATERNITY CC/RIDHU CC/image_10.jpg',
                        '/images/MATERNITY CC/RIDHU CC/image_11.jpg', '/images/MATERNITY CC/RIDHU CC/image_12.jpg', '/images/MATERNITY CC/RIDHU CC/image_13.jpg', '/images/MATERNITY CC/RIDHU CC/image_14.jpg'
                    ]
                },
                { 
                    id: 'homecard-default-4', img: '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/tamnail.jpg', cat: 'ENGAGEMENT', title: 'The Promise of Always — A Celebration of Commitment.', link: '/work/engagement', order: 4,
                    innerTitle: 'The Engagement Story — \nA Promise of Forever',
                    innerDescription1: 'Engagements are the most intimate of celebrations. The initial promise, the shy smiles, and the unfettered joy of a new chapter beginning. This story highlights the quiet grace and glowing anticipation of a couple starting their beautiful journey together.',
                    innerDescription2: 'Capturing this moment was about preserving the radiance, the strength, and the overwhelming love that defines this very special time of commitment and heartfelt connection.',
                    heroLeft: '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/1.jpg',
                    heroCenter: '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/tamnail.jpg',
                    heroRight: '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/2.jpg',
                    galleryImages: [
                        '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/1.jpg', '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/2.jpg', '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/3.jpg', '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/4.jpg',
                        '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/5.jpg', '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/6.jpg', '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/tamnail1.jpg', '/images/ENGAGEMENT-NEW/DEVA & SOWMIYA/tamnail2.jpg'
                    ]
                }
            ];
            await HomeCard.insertMany(defaultCards);
            cards = await HomeCard.find().sort({ order: 1 });
        }

        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single home card by link/slug
router.get('/:slug', async (req, res) => {
    try {
        const linkStr = `/work/${req.params.slug}`;
        const card = await HomeCard.findOne({ link: linkStr });
        if (!card) return res.status(404).json({ message: 'Story not found' });
        res.json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update home card
router.put('/:id', protect, uploadSingle('img'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.order !== undefined) updateData.order = parseInt(updateData.order);
        if (req.file) updateData.img = req.file.path;
        updateData.updatedAt = Date.now();

        const updated = await HomeCard.findOneAndUpdate(
            { id: req.params.id },
            updateData,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Upload multiple images to galleryImages
router.post('/:id/gallery', protect, uploadArray('images', 20), async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        const updated = await HomeCard.findOneAndUpdate(
            { id: req.params.id },
            { $push: { galleryImages: { $each: imageUrls } }, updatedAt: Date.now() },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete single image from galleryImages
router.delete('/:id/gallery', protect, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const updated = await HomeCard.findOneAndUpdate(
            { id: req.params.id },
            { $pull: { galleryImages: imageUrl }, updatedAt: Date.now() },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete and POST skipped per requirement

module.exports = router;

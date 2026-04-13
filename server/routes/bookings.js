const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');
const StorageService = require('../services/storageService');

// @desc    Create new booking (Zero-Fail Mode: Local Backup + Notifications)
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // 💡 STEP 1: Backup to local file (Safety Net)
    const isSaved = await StorageService.saveInquiry(bookingData);

    // 💡 STEP 2: Trigger Notifications
    // We attempt notifications, but the lead is already safe if isSaved is true.
    const isNotified = await NotificationService.notifyAll(bookingData);

    if (isSaved) {
      res.status(201).json({ 
        success: true, 
        message: isNotified 
          ? 'Inquiry received and notifications delivered successfully.' 
          : 'Inquiry received. We will contact you soon.'
      });
    } else {
      // Only returns error if even the local backup failed
      res.status(500).json({ 
        success: false, 
        message: 'Please try again later. (Backup Error)' 
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all bookings (from local safety-net storage)
// @route   GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await StorageService.getAllInquiries();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update booking status (Removed as part of Zero-DB transition)
// @route   PATCH /api/bookings/:id
router.patch('/:id', protect, async (req, res) => {
    res.status(501).json({ message: 'Status updates are disabled in Zero-DB mode.' });
});

module.exports = router;

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
    // Even if notifications fail, the lead is safely stored on the server.
    await StorageService.saveInquiry(bookingData);

    // 💡 STEP 2: Trigger Notifications (Blocking)
    // We now WAIT for the email/whatsapp to succeed before telling the user "Success"
    const isNotified = await NotificationService.notifyAll(bookingData);

    if (isNotified) {
      // Return success only if notifications were delivered
      res.status(201).json({ 
        success: true, 
        message: 'Inquiry received and notifications delivered successfully.' 
      });
    } else {
      // If email failed after all retries, return an error even if it was backed up
      res.status(500).json({ 
        success: false, 
        message: 'Please try again later.' 
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

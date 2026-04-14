const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');
const StorageService = require('../services/storageService');

/**
 * Booking Routes (Zero-DB Mode)
 * Focuses on direct notification delivery to Admin via Email/WhatsApp.
 */

// @desc    Create new booking
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  console.log('[API] Received new booking inquiry:', req.body.name);
  try {
    const bookingData = req.body;
    
    // 💡 STEP 1: Trigger Immediate Notifications (Email/WhatsApp)
    // We attempt to notify the admin immediately. the service handles retries.
    const isNotified = await NotificationService.notifyAll(bookingData);

    // 💡 STEP 2: Safety Backup to local file 
    // This serves as a secondary record in case of notification failure.
    await StorageService.saveInquiry(bookingData);

    res.status(201).json({ 
      success: true, 
      message: isNotified 
        ? 'Your inquiry has been sent directly to our team via Email & WhatsApp.' 
        : 'Inquiry received. We will contact you shortly.'
    });
  } catch (error) {
    console.error('[API Error] Booking submission failed:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Get all bookings (Safety net backup)
// @route   GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await StorageService.getAllInquiries();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update booking status (Disabled in Zero-DB mode)
router.patch('/:id', protect, async (req, res) => {
    res.status(501).json({ message: 'Status updates are disabled in Zero-DB mode.' });
});

module.exports = router;

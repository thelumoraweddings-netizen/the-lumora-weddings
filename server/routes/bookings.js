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
router.post('/', (req, res) => {
  const bookingData = req.body;
  console.log('[API] Received new booking inquiry:', bookingData.name);

  // ⚡ Snappy Response: Send success immediately to the client
  res.status(201).json({ 
    success: true, 
    message: 'Your inquiry has been captured! We will contact you via Email & WhatsApp shortly.'
  });

  // 🛠️ Background Processing: Handle storage and notifications without blocking the client
  (async () => {
    try {
      // Step 1: Safety Backup to local file
      await StorageService.saveInquiry(bookingData);

      // Step 2: Trigger Notifications (Email/WhatsApp)
      await NotificationService.notifyAll(bookingData);
    } catch (error) {
      console.error('[Background Processing Error] Booking tasks failed:', error.message);
    }
  })();
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

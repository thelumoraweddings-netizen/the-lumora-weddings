const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');
const StorageService = require('../services/storageService');

// @desc    Create new booking
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  const bookingData = req.body;
  console.log('[API] Received new booking inquiry:', bookingData.name);

  try {
    // 1. Save to JSON Database (Fallback Storage)
    const newBooking = await StorageService.saveBooking(bookingData);

    // 2. Send success immediately to the client
    res.status(201).json({ 
      success: true, 
      message: 'Your inquiry has been captured! We will contact you via Email & WhatsApp shortly.'
    });

    // 3. Trigger Notifications (Email/WhatsApp) in the background
    (async () => {
      try {
        await NotificationService.notifyAll(bookingData);
      } catch (error) {
        console.error('[Background Processing Error] Notification tasks failed:', error.message);
      }
    })();

  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ success: false, message: 'Server error while saving inquiry' });
  }
});

// @desc    Get all bookings (For Admin Panel)
// @route   GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await StorageService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update booking status
router.patch('/:id', protect, async (req, res) => {
  try {
    const updatedBooking = await StorageService.updateBookingStatus(req.params.id, req.body.status);
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');
const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  const bookingData = req.body;
  console.log('[API] Received new booking inquiry:', bookingData.name);

  try {
    // 1. Save to MongoDB Database (Permanent Storage)
    const newBooking = new Booking(bookingData);
    await newBooking.save();

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
    console.error('Error saving booking to DB:', err);
    res.status(500).json({ success: false, message: 'Server error while saving inquiry' });
  }
});

// @desc    Get all bookings (For Admin Panel)
// @route   GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings from DB:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update booking status
router.patch('/:id', protect, async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

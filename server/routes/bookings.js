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
    const newBooking = new Booking(bookingData);
    
    // Validate data synchronously before responding
    const validationError = newBooking.validateSync();
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError.message });
    }

    // In Serverless environments (like Vercel), background tasks are frozen the moment a response is sent.
    // We MUST await the DB save and Email dispatch to ensure the client receives the email.
    await Promise.allSettled([
      newBooking.save(),
      NotificationService.notifyAll(bookingData)
    ]);
    console.log('[API] Processing completed for:', bookingData.name);

    res.status(201).json({ 
      success: true, 
      message: 'Your inquiry has been captured! We will contact you via Email & WhatsApp shortly.'
    });

  } catch (err) {
    console.error('Error in booking request:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error while processing inquiry' });
    }
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

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

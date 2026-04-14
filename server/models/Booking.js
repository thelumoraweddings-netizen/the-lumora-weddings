const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'booked', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);

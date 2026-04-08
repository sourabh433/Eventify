const express = require('express');
const router = express.Router();
const Booking = require("../models/Bookings.js");

const { protect, admin } = require('../middleware/auth');


const {
  bookEvent,
  sendBookingOTP,
  getMyBookings,
  confirmBooking,
  cancelBooking
} = require('../controllers/bookingController');

// ✅ ROUTES
router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingOTP);
router.get('/my', protect, getMyBookings);
// ✅ FIX: GET ALL BOOKINGS (ADMIN) fixed after it for tokenization
router.get('/', protect, admin, async (req, res) => {
    const bookings = await Booking.find()
        .populate('userId')
        .populate('eventId');
    res.json(bookings);
});
// router.get('/:id/confirm', protect, admin, confirmBooking); // fixed spelling
router.put('/:id/confirm', protect, admin, confirmBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
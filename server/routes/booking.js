const express = require('express');
const router = express.Router();

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
router.get('/:id/confirm', protect, admin, confirmBooking); // fixed spelling
router.delete('/:id', protect, cancelBooking);

module.exports = router;
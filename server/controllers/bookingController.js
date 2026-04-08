const Booking = require("../models/Bookings.js");
const OTP = require("../models/OTP");
const Event = require("../models/Event");
const { sendOtpEmail, sendBookingEmail } = require("../utils/email");

// 🔢 Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 📩 Send Booking OTP
exports.sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOTP();

    // delete old OTP
    await OTP.findOneAndDelete({
      email: req.user.email,
      action: "event_booking",
    });

    // save new OTP
    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
      expiresAt: Date.now() + 10 * 60 * 1000, // ✅ FIXED
    });

    // send email
    await sendOtpEmail(req.user.email, otp, "event_booking");

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🎟️ Book Event
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    // validate OTP
    const otpRecord = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // check expiry
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // check seats
    if (event.availableSeats <= 0) {
      return res.status(400).json({ error: "No seats available" });
    }

    // prevent duplicate booking
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You have already booked this event",
      });
    }

    // create booking
    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      status: "pending",
      paymentStatus: "not_paid",
      amount: event.ticketPrice,
    });

    // delete OTP after use
    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    res.status(201).json({
      message: "Booking request sent. Waiting for admin approval.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Admin Confirm Booking
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    // validate payment status
    if (!["paid", "not_paid"].includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const booking = await Booking.findById(req.params.id).populate("eventId");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({
        error: "Booking already confirmed",
      });
    }

    const event = await Event.findById(booking.eventId._id);

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        error: "No seats available",
      });
    }

    // update booking
    booking.status = "confirmed";
    booking.paymentStatus = paymentStatus;

    await booking.save();

    // reduce seats
    event.availableSeats -= 1;
    await event.save();

    // populate user
    const populatedBooking = await booking.populate("userId");

    // send confirmation email
    await sendBookingEmail(
      populatedBooking.userId.email,
      populatedBooking.userId.name,
      event.title
    );

    res.json({ message: "Booking confirmed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    }).populate("eventId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Cancel Booking (User/Admin)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    // authorization check
    if (
      booking.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    // restore seats if confirmed
    if (booking.status === "confirmed") {
      const event = await Event.findById(booking.eventId);

      if (event) {
        event.availableSeats += 1;
        await event.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
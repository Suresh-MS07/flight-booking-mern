const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const sendTicketEmail = require('../utils/emailService');

// @route   POST /api/bookings
// @desc    Create a new booking
router.post('/', async (req, res) => {
  const { passengerName, email, phone, flightInfo } = req.body;

  try {
    const newBooking = new Booking({
      passengerName,
      email,
      phone,
      flightInfo
    });

    const savedBooking = await newBooking.save();
    // 🔥 NEW: Send Email Here
    // Background mein email bhej denge, wait karne ki zaroorat nahi
    sendTicketEmail(savedBooking); 
    res.status(201).json({ message: "Booking Successful!", booking: savedBooking });
    
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to book ticket" });
  }
});
// @route   GET /api/bookings
// @desc    Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 }); // Newest pehle
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

module.exports = router;
const express = require('express');

const requireAuth = require('../middleware/auth');
const Booking = require('../models/Booking');
const sendTicketEmail = require('../utils/emailService');
const {
  createRazorpayClient,
  hasPaymentConfig,
  verifyPaymentSignature,
} = require('../services/paymentService');

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const iataPattern = /^[A-Z]{3}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

router.use(requireAuth);

router.post('/', async (req, res) => {
  const passengerName = String(req.body.passengerName || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const phone = String(req.body.phone || '').trim();
  const flightInfo = req.body.flightInfo || {};
  const payment = req.body.payment || {};
  const paymentInfo = {
    orderId: String(payment.razorpay_order_id || '').trim(),
    paymentId: String(payment.razorpay_payment_id || '').trim(),
    signature: String(payment.razorpay_signature || '').trim(),
  };
  const normalizedFlightInfo = {
    airline: String(flightInfo.airline || '').trim(),
    flightNumber: String(flightInfo.flightNumber || '').trim(),
    from: String(flightInfo.from || '').trim().toUpperCase(),
    to: String(flightInfo.to || '').trim().toUpperCase(),
    price: Number(flightInfo.price),
    date: flightInfo.date,
    seatNumber: String(flightInfo.seatNumber || '').trim().toUpperCase(),
  };
  const departureDate = new Date(`${normalizedFlightInfo.date}T00:00:00Z`);
  const isValidFlightDate = datePattern.test(String(normalizedFlightInfo.date || ''))
    && !Number.isNaN(departureDate.getTime())
    && departureDate.toISOString().startsWith(normalizedFlightInfo.date);

  const isInvalid = passengerName.length < 2
    || !emailPattern.test(email)
    || phone.length < 7
    || !normalizedFlightInfo.airline
    || !normalizedFlightInfo.flightNumber
    || !iataPattern.test(normalizedFlightInfo.from)
    || !iataPattern.test(normalizedFlightInfo.to)
    || !Number.isFinite(normalizedFlightInfo.price)
    || normalizedFlightInfo.price <= 0
    || normalizedFlightInfo.price > 1000000
    || !isValidFlightDate
    || !normalizedFlightInfo.seatNumber
    || !paymentInfo.orderId
    || !paymentInfo.paymentId
    || !paymentInfo.signature;

  if (isInvalid) {
    res.status(400).json({ message: 'Invalid passenger or flight details' });
    return;
  }

  if (!hasPaymentConfig()) {
    res.status(503).json({ message: 'Payments are not configured' });
    return;
  }

  if (!verifyPaymentSignature(paymentInfo)) {
    res.status(400).json({ message: 'Invalid payment signature' });
    return;
  }

  try {
    const razorpay = createRazorpayClient();
    const order = await razorpay.orders.fetch(paymentInfo.orderId);
    const expectedAmount = Math.round(normalizedFlightInfo.price * 100);

    if (order.status !== 'paid' || order.currency !== 'INR' || Number(order.amount) !== expectedAmount) {
      res.status(400).json({ message: 'A completed payment matching the booking total is required' });
      return;
    }

    const booking = await Booking.create({
      user: req.user.id,
      passengerName,
      email,
      phone,
      flightInfo: normalizedFlightInfo,
      paymentInfo: {
        orderId: paymentInfo.orderId,
        paymentId: paymentInfo.paymentId,
      },
    });

    void sendTicketEmail(booking);
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error(`Booking failed: ${error.message}`);
    res.status(error.code === 11000 ? 409 : 502).json({
      message: error.code === 11000
        ? 'This payment has already been used for a booking'
        : 'Unable to validate and save booking',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(`Booking lookup failed: ${error.message}`);
    res.status(500).json({ message: 'Unable to fetch bookings' });
  }
});

module.exports = router;

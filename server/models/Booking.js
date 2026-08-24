const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  passengerName: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  flightInfo: {
    airline: { type: String, required: true, trim: true },
    flightNumber: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true, uppercase: true },
    to: { type: String, required: true, trim: true, uppercase: true },
    price: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    seatNumber: { type: String, required: true, trim: true, uppercase: true },
  },
  paymentInfo: {
    orderId: { type: String, required: true, trim: true },
    paymentId: { type: String, required: true, trim: true, unique: true, sparse: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

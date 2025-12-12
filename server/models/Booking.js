const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  passengerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Flight ki details jo hum save karna chahte hain
  flightInfo: {
    airline: String,
    flightNumber: String,
    from: String,
    to: String,
    price: String, // ya Number
    date: String,
    seatNumber: String
  },
  
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Config Load
dotenv.config();

// 2. Imports
const connectDB = require('./config/db');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');
const authRoutes = require('./routes/auth'); // ✅ Auth route import
const paymentRoutes = require('./routes/payment')

// 3. Database Connect
connectDB();

// 4. App Initialize (SABSE IMPORTANT STEP)
const app = express();
const PORT = process.env.PORT || 5000;

// 5. Middleware
app.use(cors());
app.use(express.json());

// 6. Routes Setup (App banne ke baad)
app.use('/api/auth', authRoutes);       // ✅ Auth Route
app.use('/api/flights', flightRoutes);  // ✅ Flight Route
app.use('/api/bookings', bookingRoutes); // ✅ Booking Route
app.use('/api/payment', paymentRoutes);

// 7. Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
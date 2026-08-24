const express = require('express');

const requireAuth = require('../middleware/auth');
const {
  createRazorpayClient,
  hasPaymentConfig,
  verifyPaymentSignature,
} = require('../services/paymentService');

const router = express.Router();

router.use(requireAuth);

router.post('/orders', async (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) {
    res.status(400).json({ message: 'Amount must be between 1 and 1,000,000 INR' });
    return;
  }

  if (!hasPaymentConfig()) {
    res.status(503).json({ message: 'Payments are not configured' });
    return;
  }

  try {
    const razorpay = createRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    console.error(`Razorpay order failed: ${error.message}`);
    res.status(502).json({ message: 'Unable to create payment order' });
  }
});

router.post('/verify', (req, res) => {
  const orderId = String(req.body.razorpay_order_id || '');
  const paymentId = String(req.body.razorpay_payment_id || '');
  const signature = String(req.body.razorpay_signature || '');

  if (!orderId || !paymentId || !signature) {
    res.status(400).json({ message: 'Missing payment verification details' });
    return;
  }

  if (!hasPaymentConfig()) {
    res.status(503).json({ message: 'Payments are not configured' });
    return;
  }

  if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
    res.status(400).json({ message: 'Invalid payment signature' });
    return;
  }

  res.json({ message: 'Payment verified successfully' });
});

module.exports = router;

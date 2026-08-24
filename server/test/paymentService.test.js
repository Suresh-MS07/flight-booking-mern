const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { after, before, test } = require('node:test');

const { verifyPaymentSignature } = require('../services/paymentService');

const originalSecret = process.env.RAZORPAY_KEY_SECRET;
const originalKeyId = process.env.RAZORPAY_KEY_ID;

before(() => {
  process.env.RAZORPAY_KEY_ID = 'rzp_test_example';
  process.env.RAZORPAY_KEY_SECRET = 'test-secret';
});

after(() => {
  if (originalKeyId === undefined) delete process.env.RAZORPAY_KEY_ID;
  else process.env.RAZORPAY_KEY_ID = originalKeyId;

  if (originalSecret === undefined) delete process.env.RAZORPAY_KEY_SECRET;
  else process.env.RAZORPAY_KEY_SECRET = originalSecret;
});

test('accepts a valid Razorpay signature', () => {
  const orderId = 'order_123';
  const paymentId = 'pay_456';
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  assert.equal(verifyPaymentSignature({ orderId, paymentId, signature }), true);
});

test('rejects a tampered Razorpay signature', () => {
  assert.equal(verifyPaymentSignature({
    orderId: 'order_123',
    paymentId: 'pay_456',
    signature: 'invalid',
  }), false);
});

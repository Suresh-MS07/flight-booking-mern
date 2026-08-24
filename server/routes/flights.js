const express = require('express');
const Amadeus = require('amadeus');

const router = express.Router();
const iataPattern = /^[A-Z]{3}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

router.get('/search', async (req, res) => {
  const from = String(req.query.from || '').trim().toUpperCase();
  const to = String(req.query.to || '').trim().toUpperCase();
  const date = String(req.query.date || '').trim();
  const parsedDate = new Date(`${date}T00:00:00Z`);
  const isValidDate = datePattern.test(date)
    && !Number.isNaN(parsedDate.getTime())
    && parsedDate.toISOString().startsWith(date);
  const today = new Date().toISOString().slice(0, 10);

  if (!iataPattern.test(from) || !iataPattern.test(to) || !isValidDate || date < today || from === to) {
    res.status(400).json({ message: 'Provide different three-letter airport codes and a current or future date' });
    return;
  }

  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    res.status(503).json({ message: 'Flight search is not configured' });
    return;
  }

  try {
    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    });
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      adults: '1',
      max: '10',
    });
    const exchangeRate = Number(process.env.EUR_TO_INR_RATE) || 90;
    const flights = response.data.map((offer) => ({
      ...offer,
      price: {
        ...offer.price,
        currency: 'INR',
        total: Math.round(Number(offer.price.total) * exchangeRate).toString(),
      },
    }));

    res.json(flights);
  } catch (error) {
    console.error(`Flight search failed: ${error.message}`);
    res.status(502).json({ message: 'Flight provider is temporarily unavailable' });
  }
});

module.exports = router;

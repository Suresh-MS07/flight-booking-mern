const express = require('express');
const router = express.Router();
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

router.get('/search', async (req, res) => {
  const from = req.query.from.toUpperCase().trim();
  const to = req.query.to.toUpperCase().trim();
  const date = req.query.date;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      adults: '1',
      max: '10'
    });

    // 🔥 Exchange Rate Logic
    const exchangeRate = 90; 

    const modifiedData = response.data.map((offer) => {
        const originalPrice = parseFloat(offer.price.total);
        const inrPrice = (originalPrice * exchangeRate).toFixed(0); 

        // Data update kar rahe hain
        offer.price.total = inrPrice;
        return offer;
    });

    res.json(modifiedData);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;
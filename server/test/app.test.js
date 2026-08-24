const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

const app = require('../app');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /api/health reports service health', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'skybooker-api');
});

test('unknown routes return a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/unknown`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.message, 'Route not found');
});

test('booking data requires authentication', async () => {
  const response = await fetch(`${baseUrl}/api/bookings`);
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.message, 'Authentication required');
});

test('flight search stays useful with clearly marked estimates when the provider is unavailable', async () => {
  const originalClientId = process.env.AMADEUS_CLIENT_ID;
  const originalClientSecret = process.env.AMADEUS_CLIENT_SECRET;
  const departureDate = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString().slice(0, 10);

  delete process.env.AMADEUS_CLIENT_ID;
  delete process.env.AMADEUS_CLIENT_SECRET;

  try {
    const response = await fetch(`${baseUrl}/api/flights/search?from=DEL&to=BOM&date=${departureDate}`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-flight-data-source'), 'estimated');
    assert.equal(body.length, 6);
    assert.equal(body[0].source, 'estimated');
    assert.equal(body[0].bookable, false);
    assert.equal(body[0].itineraries[0].segments[0].departure.iataCode, 'DEL');
    assert.equal(body[0].itineraries[0].segments[0].arrival.iataCode, 'BOM');
  } finally {
    if (originalClientId === undefined) delete process.env.AMADEUS_CLIENT_ID;
    else process.env.AMADEUS_CLIENT_ID = originalClientId;

    if (originalClientSecret === undefined) delete process.env.AMADEUS_CLIENT_SECRET;
    else process.env.AMADEUS_CLIENT_SECRET = originalClientSecret;
  }
});

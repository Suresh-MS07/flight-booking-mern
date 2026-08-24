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

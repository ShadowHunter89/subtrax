const request = require('supertest');
const express = require('express');

// We'll mount the paymentsRouter into a small app instance for testing.
const paymentsRouter = require('../paymentsRouter');

test('GET /return/jazzcash redirects to frontend result', async () => {
  const app = express();
  app.use('/api/payments', paymentsRouter);

  const res = await request(app).get('/api/payments/return/jazzcash').query({ tx_id: 'T123', status: 'success' });
  expect(res.status).toBe(302);
  expect(res.headers.location).toMatch(/\/payments\/result\?provider=jazzcash/);
});

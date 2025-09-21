const request = require('supertest');
const app = require('../server/server');

describe('GET /api/payments/recommend', () => {
  test('returns easypaisa for Pakistan override', async () => {
    const res = await request(app)
      .get('/api/payments/recommend?amount=1000&currency=USD')
      .set('X-Country', 'pk');
    expect(res.statusCode).toBe(200);
    expect(res.body.primary).toBe('easypaisa');
  });

  test('returns paddle for default', async () => {
    const res = await request(app)
      .get('/api/payments/recommend?amount=1000&currency=USD');
    expect(res.statusCode).toBe(200);
    expect(res.body.primary).toBe('paddle');
  });
});

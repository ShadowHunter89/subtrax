const request = require('supertest');
const app = require('../server/server');

describe('GET /api/health', () => {
  it('should return status ok and openai_model key', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('openai_model');
  });
});

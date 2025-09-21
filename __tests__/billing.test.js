const request = require('supertest');
const app = require('../server/server');

describe('Billing API', () => {
  test('ingest and list', async () => {
    const payload = { provider: 'test', provider_tx_id: 'tx123', amount: 10, currency: 'USD', type: 'charge' };
    const res = await request(app).post('/api/billing/ingest').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    const list = await request(app).get('/api/billing/entries');
    expect(list.status).toBe(200);
    expect(list.body.entries.some(e => e.provider_tx_id === 'tx123')).toBe(true);
  });
});

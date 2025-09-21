const request = require('supertest');
const app = require('../server/server');

describe('billing reconcile endpoint', () => {
  test('reconcile endpoint returns updated entries for in-memory store', async () => {
    // create an ingest entry
    const payload = { provider: 'testprov', provider_tx_id: 'tx-123', amount: 10, currency: 'USD' };
    const ingest = await request(app).post('/api/billing/ingest').send(payload).expect(200);
    expect(ingest.body.ok).toBe(true);
    const entry = ingest.body.entry;
    expect(entry.provider_tx_id).toBe('tx-123');

    // reconcile
    const res = await request(app).post('/api/billing/reconcile').send({ provider: 'testprov', provider_tx_id: 'tx-123' }).expect(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.updated)).toBe(true);
    expect(res.body.updated.length).toBeGreaterThan(0);
    expect(res.body.updated[0].status).toBe('reconciled');
  });

  test('reconcile returns 400 when provider missing', async () => {
    const res = await request(app).post('/api/billing/reconcile').send({ provider_tx_id: 'tx-123' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  test('multi-tx reconcile aggregates updates', async () => {
    // create two entries with same provider but different tx ids
    const p = 'multi-prov';
    await request(app).post('/api/billing/ingest').send({ provider: p, provider_tx_id: 'a1', amount: 1 });
    await request(app).post('/api/billing/ingest').send({ provider: p, provider_tx_id: 'b2', amount: 2 });
    const res = await request(app).post('/api/billing/reconcile').send({ provider: p, provider_tx_ids: ['a1', 'b2'] }).expect(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.updated)).toBe(true);
    // should include both reconciled entries
    const txs = res.body.updated.map(u => u.provider_tx_id).sort();
    expect(txs).toEqual(['a1', 'b2']);
  });

  test('admin endpoints require ADMIN_API_KEY when set', async () => {
    // set admin key
    process.env.ADMIN_API_KEY = 'admintestkey';
    // without auth header should 401
    const r1 = await request(app).get('/api/billing/entries');
    expect(r1.status).toBe(401);
    // with wrong header -> 403
    const r2 = await request(app).get('/api/billing/entries').set('Authorization', 'Bearer wrong').expect(403);
    // with correct header -> 200
    const r3 = await request(app).get('/api/billing/entries').set('Authorization', 'Bearer admintestkey').expect(200);
    expect(r3.body.ok).toBe(true);
    delete process.env.ADMIN_API_KEY;
  });

  test('patch entry updates fields', async () => {
    // create an entry
    const p = 'edit-prov';
    const ing = await request(app).post('/api/billing/ingest').send({ provider: p, provider_tx_id: 'edit-1', amount: 50 });
    expect(ing.body.ok).toBe(true);
    const id = ing.body.entry.id;
    // update
    const res = await request(app).patch(`/api/billing/entry/${id}`).send({ amount: 75 }).expect(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.updated.amount).toBe(75);
  });

  test('patch non-existing returns 404', async () => {
    const res = await request(app).patch('/api/billing/entry/not-there').send({ amount: 1 });
    expect(res.status).toBe(404);
  });
});

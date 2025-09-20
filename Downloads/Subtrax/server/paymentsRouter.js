const express = require('express');
const { getProvider } = require('./payments');
const redisClient = require('./lib/redisClient');

const router = express.Router();
const { recommendProvider } = require('./providerSelector');

// Create checkout: POST /api/payments/create
router.post('/create', async (req, res) => {
  const { provider, amount, title, email, returnUrl } = req.body;
  const adapter = getProvider(provider);
  if (!adapter) return res.status(400).json({ error: 'Unknown payment provider' });
  try {
    const result = await adapter.createCheckout({ title, price: amount, customerEmail: email, returnUrl });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

  // Recommendation: GET /api/payments/recommend?amount=1000&currency=USD
  router.get('/recommend', (req, res) => {
    const amount = Number(req.query.amount) || 0;
    const currency = req.query.currency || 'USD';
    const rec = recommendProvider(req, amount, currency);
    res.json(rec);
  });

// Webhook: POST /api/payments/webhook/:provider
router.post('/webhook/:provider', express.urlencoded({ extended: true }), async (req, res) => {
  const providerName = req.params.provider;
  const adapter = getProvider(providerName);
  if (!adapter) return res.status(404).send('Unknown provider');

  const eventId = req.body && (req.body.alert_id || req.body.alert_name || req.body.event_id || req.body.order_id || JSON.stringify(req.body));
  try {
    // idempotency key
    const key = `payment_event:${providerName}:${eventId}`;
    const set = await redisClient.setIfNotExists(key, '1', 24 * 60 * 60);
    if (!set) {
      // already processed
      return res.status(200).send('ignored');
    }

    // verify and process
    const signature = req.headers['x-paddle-signature'] || req.headers['x-easypaisa-signature'] || null;
    const verification = adapter.verifyWebhook ? adapter.verifyWebhook(req.body, signature) : { ok: true };
    if (!verification.ok) {
      return res.status(400).json({ error: 'webhook verification failed', details: verification });
    }

    // TODO: dispatch event to internal processing (billing, DB, notifications)
    console.log('Payment webhook received for', providerName, req.body);
    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook handling error', err);
    res.status(500).send('error');
  }
});

module.exports = router;

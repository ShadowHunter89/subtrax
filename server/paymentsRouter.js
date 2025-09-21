const express = require('express');
const { getProvider } = require('./payments');
const redisClient = require('./lib/redisClient');

const router = express.Router();
const { recommendProvider } = require('./providerSelector');

// Return/redirect handler for JazzCash (user-facing). JazzCash will redirect
// the customer's browser back to this endpoint after payment. We try to
// reconcile the provider transaction id server-side, then redirect the user to
// a frontend results page.
router.get('/return/jazzcash', async (req, res) => {
  const params = req.query || {};
  const provider_tx_id = params.tx_id || params.order_id || params.tx || params.transaction_id || '';
  const status = params.status || params.payment_result || 'unknown';
  try {
    if (provider_tx_id) {
      const billing = require('./billing');
      // attempt auto-reconcile (no-op if not found)
      try {
        await billing.reconcileByProviderTx('jazzcash', provider_tx_id);
      } catch (e) {
        console.warn('Auto-reconcile failed for return:', e && e.message ? e.message : e);
      }
    }

    // Determine frontend base URL in a flexible way so the server can be
    // deployed behind any frontend host. Preference order:
    // 1) FRONTEND_BASE_URL env (full URL e.g. https://example.com)
    // 2) request Origin header (if present)
    // 3) Referer header base (if present)
    // 4) FIREBASE_AUTH_DOMAIN env (project-based domain)
    // 5) fallback host used for local testing or earlier docs
    const { computeFrontendBase } = require('./lib/frontendBase');
    let frontendBase = computeFrontendBase(req);
    if (!frontendBase && process.env.FIREBASE_AUTH_DOMAIN) frontendBase = `https://${process.env.FIREBASE_AUTH_DOMAIN}`;
    if (!frontendBase) {
      // No frontend base could be determined; return a small page with the
      // information the frontend would normally receive so integrators can
      // complete the flow manually.
      return res.status(200).json({
        ok: true,
        info: 'No frontend base URL configured or detected. Set FRONTEND_BASE_URL or FRONTEND_ALLOWED_ORIGINS, or ensure Origin/Referer headers are sent by your provider.',
        provider: 'jazzcash',
        status,
        order: provider_tx_id
      });
    }

    const redirectUrl = `${frontendBase}/payments/result?provider=jazzcash&status=${encodeURIComponent(status)}&order=${encodeURIComponent(provider_tx_id)}`;
    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('Return handling error', err);
    return res.status(500).send('error');
  }
});

// Accept POST-based returns as well (some providers POST back to return URLs)
router.post('/return/jazzcash', express.urlencoded({ extended: true }), async (req, res) => {
  const params = req.body || {};
  const provider_tx_id = params.tx_id || params.order_id || params.tx || params.transaction_id || '';
  const status = params.status || params.payment_result || 'unknown';
  try {
    if (provider_tx_id) {
      const billing = require('./billing');
      try {
        await billing.reconcileByProviderTx('jazzcash', provider_tx_id);
      } catch (e) {
        console.warn('Auto-reconcile failed for return (POST):', e && e.message ? e.message : e);
      }
    }
    const { computeFrontendBase } = require('./lib/frontendBase');
    let frontendBase = computeFrontendBase(req);
    if (!frontendBase && process.env.FIREBASE_AUTH_DOMAIN) frontendBase = `https://${process.env.FIREBASE_AUTH_DOMAIN}`;
    const redirectUrl = frontendBase ? `${frontendBase}/payments/result?provider=jazzcash&status=${encodeURIComponent(status)}&order=${encodeURIComponent(provider_tx_id)}` : null;
    // Some providers expect a simple 200 response rather than a redirect when POSTing back.
    // We'll redirect to the frontend for browser-based POSTs and return 200 for API callers.
    if (req.headers['user-agent'] && req.headers['user-agent'].includes('Mozilla')) {
      if (redirectUrl) return res.redirect(302, redirectUrl);
      return res.status(200).send('ok');
    }
    return res.status(200).json({ ok: true, redirect: redirectUrl });
  } catch (err) {
    console.error('Return handling error (POST)', err);
    return res.status(500).send('error');
  }
});

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
// Use raw parser so adapters can verify signatures against exact raw payload when required
router.post('/webhook/:provider', express.raw({ type: '*/*' }), async (req, res) => {
  const providerName = req.params.provider;
  const adapter = getProvider(providerName);
  if (!adapter) return res.status(404).send('Unknown provider');

  // raw payload text
  const raw = req.body && Buffer.isBuffer(req.body) ? req.body.toString('utf8') : (typeof req.body === 'string' ? req.body : '');
  // parse body heuristically depending on content-type
  let parsedBody = {};
  try {
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (ct.includes('application/json')) parsedBody = JSON.parse(raw || '{}');
    else if (ct.includes('application/x-www-form-urlencoded')) {
      const qs = require('querystring'); parsedBody = qs.parse(raw);
    } else {
      // try json then fallback to empty
      parsedBody = raw ? JSON.parse(raw) : {};
    }
  } catch (e) {
    parsedBody = {};
  }

  const eventId = parsedBody && (parsedBody.alert_id || parsedBody.alert_name || parsedBody.event_id || parsedBody.order_id || JSON.stringify(parsedBody));
  try {
    // idempotency key
    const key = `payment_event:${providerName}:${eventId}`;
    const set = await redisClient.setIfNotExists(key, '1', 24 * 60 * 60);
    if (!set) {
      // already processed
      return res.status(200).send('ignored');
    }
    // verify and process: pass parsed body, raw payload and headers to adapter
    const verification = adapter.verifyWebhook ? adapter.verifyWebhook(parsedBody, raw, req.headers) : { ok: true };
    if (!verification.ok) {
      console.warn('Webhook verification failed for provider', providerName, verification);
      return res.status(400).json({ error: 'webhook verification failed', details: verification });
    }

    // Provider-specific hardening (optional): IP allowlist and shared-secret header.
    // Useful when you want extra assurance beyond signature verification.
    try {
      if (providerName === 'jazzcash') {
        // IP allowlist: set JAZZCASH_ALLOWED_IPS to a comma-separated list of IPs
        const allowed = (process.env.JAZZCASH_ALLOWED_IPS || '').split(',').map(s => s.trim()).filter(Boolean);
        const xfwd = req.headers['x-forwarded-for'];
        const remoteIp = xfwd ? xfwd.split(',')[0].trim() : (req.ip || '');
        if (allowed.length && !allowed.includes(remoteIp)) {
          console.warn('Rejecting JazzCash webhook from non-allowed IP', remoteIp);
          return res.status(403).json({ error: 'ip-not-allowed', ip: remoteIp });
        }

        // Shared secret header: set JAZZCASH_WEBHOOK_SECRET to require a header
        const webhookSecret = process.env.JAZZCASH_WEBHOOK_SECRET;
        if (webhookSecret) {
          const header = req.headers['x-jazz-auth'] || req.headers['x-jazzcash-auth'] || req.headers['x-jazzcash-signature'];
          if (!header || header !== webhookSecret) {
            console.warn('Rejecting JazzCash webhook due to missing/invalid webhook secret');
            return res.status(403).json({ error: 'invalid-webhook-secret' });
          }
        }
      }
    } catch (e) {
      console.warn('Webhook hardening check failed', e && e.message ? e.message : e);
    }

    // dispatch event to internal processing (billing ingestion, notifications)
    try {
      const billing = require('./billing');
      // normalize common fields
      const normalized = {
        provider: providerName,
        provider_tx_id: req.body.order_id || req.body.alert_id || req.body.tx || req.body.transaction_id || null,
        type: req.body.type || 'charge',
        amount: req.body.amount || req.body.sale_gross || req.body.value || 0,
        currency: req.body.currency || 'USD',
        status: 'completed',
        timestamp: new Date().toISOString(),
        metadata: { raw: req.body }
      };
      const entry = await billing.createEntry(normalized);

      // Optionally auto-reconcile if provider_tx_id exists
      if (normalized.provider_tx_id) {
        await billing.reconcileByProviderTx(providerName, normalized.provider_tx_id);
      }
      console.log('Ingested billing entry', entry.id);
    } catch (e) {
      console.error('Billing ingestion failed', e);
    }
    res.status(200).send('ok');
  } catch (err) {
    console.error('Webhook handling error', err);
    res.status(500).send('error');
  }
});

module.exports = router;

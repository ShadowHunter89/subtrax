// EasyPaisa adapter (sandbox-friendly)
// Note: Real EasyPaisa integration requires merchant registration and following their API spec.
// This adapter provides a sandbox flow and interface compatible with the payments factory.

const crypto = require('crypto');

const EASYPAYSA_API_KEY = process.env.EASYPAYSA_API_KEY || null;
const EASYPAYSA_WEBHOOK_SECRET = process.env.EASYPAYSA_WEBHOOK_SECRET || null;
const EASYPAYSA_CHECKOUT_URL = process.env.EASYPAYSA_CHECKOUT_URL || 'https://merchant.easypaisa.com/api/v1/payment';
const EASYPAYSA_TIMEOUT_MS = parseInt(process.env.EASYPAYSA_TIMEOUT_MS || '10000', 10);

async function createPayment({ amount, phone, description, returnUrl }) {
  // In sandbox mode (no API key), return a simulated redirect URL the frontend can use to mock checkout
  if (!EASYPAYSA_API_KEY) {
    const fakeTx = `sandbox-${Date.now()}`;
    return {
      status: 'ok',
      provider: 'easypaisa',
      transaction_id: fakeTx,
      checkout_url: `${returnUrl || 'https://example.com/complete'}?provider=easypaisa&tx=${fakeTx}`
    };
  }
  // Attempt a production call - endpoint and params are driven by envs
  try {
    const https = require('https');
    const postData = JSON.stringify({ amount, phone, description, returnUrl });
    const url = new URL(EASYPAYSA_CHECKOUT_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + (url.search || ''),
      method: 'POST',
      timeout: EASYPAYSA_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EASYPAYSA_API_KEY}`
      }
    };
    const resp = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (d) => data += d);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy(new Error('EasyPaisa request timed out'));
      });
      req.write(postData);
      req.end();
    });
    const parsed = JSON.parse(resp);
    // expected parsed to contain checkout_url or transaction id
    return { status: 'ok', checkout_url: parsed.checkout_url || parsed.redirect_url || null, raw: parsed };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('EasyPaisa production call failed:', err && err.message ? err.message : err);
    return { status: 'error', message: 'EasyPaisa production call failed', error: err && err.message ? err.message : err };
  }
}

function verifyWebhook(body, raw, headers) {
  // EasyPaisa webhook verification details depend on the merchant setup.
  // Provide a permissive pass when no API key is set for sandbox testing.
  if (!EASYPAYSA_API_KEY) return { ok: true, note: 'sandbox mode' };

  // Example HMAC verification (replace with actual spec). Many providers sign raw payloads.
  try {
    const signature = headers['x-easypaisa-signature'] || headers['x-signature'] || null;
    if (!signature) return { ok: false, error: 'signature header missing' };
    const secret = EASYPAYSA_WEBHOOK_SECRET || EASYPAYSA_API_KEY;
    if (!secret) return { ok: false, error: 'no webhook secret configured' };
    const expected = crypto.createHmac('sha256', secret).update(typeof raw === 'string' ? raw : JSON.stringify(body)).digest('hex');
    return { ok: expected === signature };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { createPayment, verifyWebhook };

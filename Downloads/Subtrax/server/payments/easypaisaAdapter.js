// EasyPaisa adapter (sandbox-friendly)
// Note: Real EasyPaisa integration requires merchant registration and following their API spec.
// This adapter provides a sandbox flow and interface compatible with the payments factory.

const crypto = require('crypto');

const EASYPAYSA_API_KEY = process.env.EASYPAYSA_API_KEY || null;

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
  // Attempt a production call (skeleton) - replace endpoint and params per EasyPaisa merchant docs
  try {
    const https = require('https');
    const postData = JSON.stringify({ amount, phone, description, returnUrl });
    const options = {
      hostname: 'easypaisa.example.com', // TODO: replace with real endpoint
      path: '/api/v1/payment',
      method: 'POST',
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
      req.write(postData);
      req.end();
    });
    const parsed = JSON.parse(resp);
    // expected parsed to contain checkout_url or transaction id
    return { status: 'ok', checkout_url: parsed.checkout_url || parsed.redirect_url || null, raw: parsed };
  } catch (err) {
    return { status: 'error', message: 'EasyPaisa production call failed', error: err.message };
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
    const expected = crypto.createHmac('sha256', EASYPAYSA_API_KEY).update(typeof raw === 'string' ? raw : JSON.stringify(body)).digest('hex');
    return { ok: expected === signature };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { createPayment, verifyWebhook };

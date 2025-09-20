// JazzCash adapter skeleton (production requires merchant credentials and API specifics)
const https = require('https');

const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID;
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD;

async function createPayment({ amount, msisdn, description, returnUrl }) {
  if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD) {
    return { status: 'error', message: 'JazzCash credentials not configured' };
  }
  // TODO: Construct and POST to JazzCash payment API per their docs
  return { status: 'error', message: 'JazzCash adapter not implemented; provide merchant credentials and implement per API docs' };
}

function verifyWebhook(body, signature) {
  // Implement verification per JazzCash webhook spec
  return { ok: true, note: 'verification not implemented' };
}

module.exports = { createPayment, verifyWebhook };

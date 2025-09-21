// JazzCash adapter
// - This adapter provides a small, configurable helper to build the payment form
//   payload (frontend posts to JazzCash) and a flexible webhook verification
//   function. JazzCash's exact secure-hash/signature algorithm can vary by
//   integration, so this code tries a common HMAC-SHA256 pattern using an
//   integrity salt. Adjust `generateSecureHash` if JazzCash expects a different
//   canonical string.
const crypto = require('crypto');

const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID;
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD;
const JAZZCASH_INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT; // provided by JazzCash (sandbox/production)
const JAZZCASH_CATEGORY_CODE = process.env.JAZZCASH_CATEGORY_CODE || '';
const JAZZCASH_CHECKOUT_URL = process.env.JAZZCASH_CHECKOUT_URL || 'https://sandbox.jazzcash.com.pk/pg/Payments/DoPayment';

function generateSecureHash(params, salt) {
  // Canonicalize: sort keys, concatenate values with '|' (common pattern).
  // NOTE: JazzCash may require a slightly different canonicalization. If
  // they provide a sample string, update this function to match it exactly.
  const keys = Object.keys(params).sort();
  const concat = keys.map((k) => String(params[k] == null ? '' : params[k])).join('|');
  if (!salt) {
    // Fallback: SHA256 of concat if no salt
    return crypto.createHash('sha256').update(concat).digest('hex');
  }
  return crypto.createHmac('sha256', salt).update(concat).digest('hex');
}

async function createPayment({ amount, msisdn, description, returnUrl, orderId }) {
  if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD) {
    return { status: 'error', message: 'JazzCash credentials not configured' };
  }

  // Build the payload that the frontend can post to JazzCash checkout.
  // Fields below are typical; verify exact field names from JazzCash docs and
  // adjust as needed.
  const txnRef = orderId || `order_${Date.now()}`;
  const payload = {
    merchant_id: JAZZCASH_MERCHANT_ID,
    password: JAZZCASH_PASSWORD,
    amount: amount,
    txn_ref: txnRef,
    return_url: returnUrl,
    customer_msisdn: msisdn || '',
    description: description || '',
    category_code: JAZZCASH_CATEGORY_CODE,
  };

  // Attach a secure hash if an integrity salt is configured. The receiving
  // JazzCash integration will verify this value. If JazzCash expects a
  // different key name (e.g. pp_SecureHash) you can map it here.
  if (JAZZCASH_INTEGRITY_SALT) {
    payload.secure_hash = generateSecureHash(payload, JAZZCASH_INTEGRITY_SALT);
  }

  // Return the form data for the frontend to post to JazzCash's checkout URL.
  return {
    status: 'ok',
    checkout: {
      method: 'POST',
      url: JAZZCASH_CHECKOUT_URL,
      params: payload,
    },
  };
}

function verifyWebhook(body, raw, headers) {
  // Attempt to verify common signature fields. JazzCash may send a field named
  // 'secure_hash', 'pp_SecureHash', 'signature', or similar. We compute a
  // HMAC-SHA256 over a canonicalized payload using the provided integrity salt
  // and compare. If no recognizable signature is present we return a note so
  // the webhook handler can decide whether to accept or require manual review.

  if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD) {
    return { ok: true, note: 'no-credentials' };
  }

  const sigFields = ['secure_hash', 'pp_SecureHash', 'signature', 'hash'];
  let incomingSig = null;
  let sigKey = null;
  for (const k of sigFields) {
    if (Object.prototype.hasOwnProperty.call(body, k)) {
      incomingSig = String(body[k]);
      sigKey = k;
      break;
    }
  }

  if (!incomingSig) {
    return { ok: false, error: 'no-signature', note: 'no known signature field present' };
  }

  if (!JAZZCASH_INTEGRITY_SALT) {
    return { ok: false, error: 'no-integrity-salt', note: 'server missing JAZZCASH_INTEGRITY_SALT to verify signature' };
  }

  // Build verification payload: remove the signature field itself before
  // canonicalization.
  const verifyPayload = { ...body };
  delete verifyPayload[sigKey];

  const expected = generateSecureHash(verifyPayload, JAZZCASH_INTEGRITY_SALT);
  const ok = expected === incomingSig;
  return ok ? { ok: true } : { ok: false, error: 'signature-mismatch', expected, incoming: incomingSig };
}

module.exports = { createPayment, verifyWebhook, generateSecureHash };

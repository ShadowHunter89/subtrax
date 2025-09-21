const https = require('https');
const querystring = require('querystring');
const crypto = require('crypto');

const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID;
const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
const PADDLE_PUBLIC_KEY = process.env.PADDLE_PUBLIC_KEY; // for webhook verification (optional)

async function createCheckout({ title, price, customerEmail, returnUrl }) {
  if (!PADDLE_VENDOR_ID || !PADDLE_API_KEY) {
    return { status: 'error', message: 'Paddle credentials not configured' };
  }

  // Paddle provides hosted checkout via vendor API: https://developer.paddle.com/api-reference/0b1c0d2a91d2c-createcheckout
  const postData = querystring.stringify({
    vendor_id: PADDLE_VENDOR_ID,
    vendor_auth_code: PADDLE_API_KEY,
    title: title || 'Subscription',
    price: String(price || 0),
    customer_email: customerEmail || '',
    return_url: returnUrl || ''
  });

  const options = {
    hostname: 'vendors.paddle.com',
    path: '/api/2.0/product/generate_pay_link',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  try {
    const respBody = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    const parsed = JSON.parse(respBody);
    if (parsed && parsed.success) {
      return { status: 'ok', checkout_url: parsed.response.url };
    }
    return { status: 'error', message: parsed };
  } catch (err) {
    return { status: 'error', message: err.message || String(err) };
  }
}

function verifyWebhook(body, raw, headers) {
  // Paddle webhooks use RSA signatures (public key verification). If PADDLE_PUBLIC_KEY is provided, verify it.
  if (!PADDLE_PUBLIC_KEY) return { ok: true, note: 'no public key configured' };
  try {
    // Paddle provides a signature in the form field `p_signature` when using form-data.
    // When receiving raw body we may have parsed form fields in `body`.
    const signature = (body && body.p_signature) || headers['x-paddle-signature'] || null;
    if (!signature) return { ok: false, error: 'signature missing' };
    // Paddle expects verification over a canonicalized map of the POST fields excluding p_signature.
    // Implement a best-effort canonicalization: sort keys alphabetically and concat values per Paddle docs.
    const keys = Object.keys(body || {}).filter(k => k !== 'p_signature').sort();
    let toVerify = '';
    for (const k of keys) {
      const val = body[k];
      if (Array.isArray(val)) {
        toVerify += val.join(',');
      } else if (typeof val === 'object') {
        toVerify += JSON.stringify(val);
      } else {
        toVerify += String(val || '');
      }
    }
    const verifier = crypto.createVerify('sha1');
    verifier.update(toVerify);
    const ok = verifier.verify(PADDLE_PUBLIC_KEY, signature, 'base64');
    return { ok };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { createCheckout, verifyWebhook };

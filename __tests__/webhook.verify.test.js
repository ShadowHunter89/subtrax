const paddleAdapter = require('../server/payments/paddleAdapter');
const easypaisaAdapter = require('../server/payments/easypaisaAdapter');
const crypto = require('crypto');

describe('webhook verification', () => {
  test('easypaisa HMAC verification (sandbox bypass when no key)', () => {
    // In our env during tests EASYPAYSA_API_KEY is likely unset so adapter returns ok
    const res = easypaisaAdapter.verifyWebhook({ tx: '123' }, JSON.stringify({ tx: '123' }), { 'x-easypaisa-signature': 'none' });
    expect(res.ok).toBe(true);
  });

  test('easypaisa HMAC matches when key set', () => {
    // simulate key
    const key = 'testkey123';
    process.env.EASYPAYSA_API_KEY = key;
    const body = { tx: 'tx-1', amount: 100 };
    const raw = JSON.stringify(body);
    const signature = crypto.createHmac('sha256', key).update(raw).digest('hex');
    const res = easypaisaAdapter.verifyWebhook(body, raw, { 'x-easypaisa-signature': signature });
    expect(res.ok).toBe(true);
    delete process.env.EASYPAYSA_API_KEY;
  });

  test('paddle RSA verification simulated', () => {
    // Generate keypair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    // set env public key
    process.env.PADDLE_PUBLIC_KEY = publicKey.export({ type: 'spki', format: 'pem' });
    // payload
    const body = { order_id: 'o-1', amount: '10.00', currency: 'USD' };
    // canonicalize: sort keys and concat values
    const keys = Object.keys(body).sort();
    let toSign = '';
    for (const k of keys) toSign += String(body[k]);
    const signer = crypto.createSign('sha1');
    signer.update(toSign);
    const signature = signer.sign(privateKey, 'base64');
    const res = paddleAdapter.verifyWebhook(body, JSON.stringify(body), { 'x-paddle-signature': signature });
    expect(res.ok).toBe(true);
    delete process.env.PADDLE_PUBLIC_KEY;
  });
});

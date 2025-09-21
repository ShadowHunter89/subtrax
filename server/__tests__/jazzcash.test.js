const { generateSecureHash } = require('../payments/jazzcashAdapter');

test('generateSecureHash with salt matches expected HMAC', () => {
  const params = { a: '1', b: 'two', c: 'three' };
  const salt = 'by8u28y09v';
  const hash = generateSecureHash(params, salt);
  // deterministic test: compute expected value with same algorithm
  const crypto = require('crypto');
  const keys = Object.keys(params).sort();
  const concat = keys.map((k) => String(params[k] == null ? '' : params[k])).join('|');
  const expected = crypto.createHmac('sha256', salt).update(concat).digest('hex');
  expect(hash).toBe(expected);
});

const { createPayment } = require('../payments/easypaisaAdapter');

test('EasyPaisa sandbox returns fake checkout url when no API key', async () => {
  process.env.EASYPAYSA_API_KEY = '';
  const res = await createPayment({ amount: 100, phone: '03001234567', description: 'Test', returnUrl: 'https://example.com/return' });
  expect(res).toBeDefined();
  expect(res.provider).toBe('easypaisa');
  expect(res.checkout_url).toMatch(/https:\/\/example.com\/return\?provider=easypaisa&tx=sandbox-\d+/);
});

// EasyPaisa integration sample (placeholder)
// EasyPaisa requires registering a merchant account and following their API docs.
// This file shows a sample adapter interface. Replace with real API calls.

async function createPayment({ amount, phone, description }) {
  // Placeholder: call EasyPaisa API to create a payment request
  // Return an object with a redirect URL or transaction id
  return { status: 'not-implemented', message: 'EasyPaisa integration requires merchant account' };
}

module.exports = { createPayment };

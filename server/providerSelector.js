// Simple provider selector based on country header or Accept-Language
function detectCountryFromReq(req) {
  // Allow override via X-Country for testing/dev
  if (req.headers['x-country']) return req.headers['x-country'].toLowerCase();
  const lang = req.headers['accept-language'] || '';
  if (lang.startsWith('ur') || lang.includes('ur')) return 'pk';
  if (lang.includes('en-pk')) return 'pk';
  // naive fallback: if first language includes pk mapping
  return 'us';
}

function recommendProvider(req, amountCents, currency) {
  const country = detectCountryFromReq(req);
  // If Pakistan, recommend EasyPaisa (local) and provide Paddle as fallback
  if (country === 'pk') {
    return { primary: 'easypaisa', secondary: 'paddle', currency: 'PKR', price: amountCents }; // price handling left to pricing layer
  }
  // default: Paddle for international
  return { primary: 'paddle', secondary: 'easypaisa', currency: currency || 'USD', price: amountCents };
}

module.exports = { detectCountryFromReq, recommendProvider };

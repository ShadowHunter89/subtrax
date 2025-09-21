// Payments factory: pick provider adapter based on region or requested provider
const paddle = require('./paddleAdapter');
const easypaisa = require('./easypaisaAdapter');
const jazzcash = require('./jazzcashAdapter');

const PROVIDERS = {
  paddle,
  easypaisa
  , jazzcash
};

function getProvider(name) {
  if (!name) return PROVIDERS.paddle; // default to Paddle for international
  return PROVIDERS[name] || null;
}

module.exports = { getProvider };

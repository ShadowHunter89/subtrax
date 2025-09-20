// Minimal pricing helper: exchange rates are static for now. Replace with real FX service in production.
const RATES = {
  USD: 1,
  PKR: 285 // example: 1 USD = 285 PKR
};

function convert(amount, from = 'USD', to = 'USD') {
  if (from === to) return amount;
  const inUsd = amount / (RATES[from] || 1);
  return Math.round(inUsd * (RATES[to] || 1) * 100) / 100;
}

function format(amount, currency) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

module.exports = { convert, format };

// Helper: take a backend checkout payload and auto-submit the POST form to JazzCash.
// Usage example (frontend):
// const res = await fetch('/api/payments/create', { method: 'POST', body: JSON.stringify({ provider: 'jazzcash', amount: 1000, title: 'Pro', returnUrl: 'https://.../payments/return/jazzcash' }) });
// const data = await res.json(); if (data.checkout) submitJazzCashForm(data.checkout);

export function submitJazzCashForm(checkout) {
  if (!checkout || checkout.method !== 'POST' || !checkout.url) throw new Error('invalid checkout payload');
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = checkout.url;
  form.style.display = 'none';
  for (const [k, v] of Object.entries(checkout.params || {})) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = k;
    input.value = String(v == null ? '' : v);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

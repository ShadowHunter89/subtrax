# Payments Integration Guide

This document outlines how to integrate local Pakistan gateways (EasyPaisa, JazzCash) and an international SaaS-friendly provider (Paddle).

Environment variables

- `PADDLE_VENDOR_ID`
- `PADDLE_API_KEY`
- `PADDLE_PUBLIC_KEY` (optional, for webhook verification)
- `EASYPAYSA_API_KEY` (placeholder)
- `REDIS_URL` (recommended for webhook idempotency)

Adapters

- `server/payments/paddleAdapter.js` — creates hosted Paddle checkout links and verifies webhooks.
- `server/payments/easypaisaAdapter.js` — EasyPaisa sandbox adapter; replace with merchant-specific API calls for production.
- `server/payments/index.js` — factory to pick an adapter.

Recommended flow

1. Create payment on server with `getProvider(name).createCheckout(...)`.
2. Redirect user to provider `checkout_url`.
3. Provider calls your webhook; verify signature and apply Redis-backed idempotency.

Testing

Use sandbox/test credentials from each provider and expose your local server with `ngrok` for webhook testing.

E2E / ngrok guidance

1. Start local server (from repo root):

```bash
npm run start
```

2. Expose local server with ngrok:

```bash
ngrok http 5000
```

3. Use the public ngrok URL as your webhook/return URL in provider sandbox dashboards. Run flows end-to-end and observe webhook receipts in your server logs.

PR Body Draft

Title: feat(payments): add Paddle, EasyPaisa, JazzCash adapters + smart checkout routing

Description:
- Adds Paddle adapter (`server/payments/paddleAdapter.js`) to create hosted checkout links.
- Adds EasyPaisa sandbox adapter (`server/payments/easypaisaAdapter.js`) and JazzCash adapter skeleton for future implementation.
- Adds payments factory and router (`server/payments/index.js`, `server/paymentsRouter.js`) with `/api/payments/create` and `/api/payments/webhook/:provider` endpoints.
- Adds provider selection (`server/providerSelector.js`) and recommendation endpoint (`GET /api/payments/recommend`).
- Adds frontend `client/src/CheckoutButtons.tsx` and wires it into the subscription UI (`SubscriptionDashboard.tsx`).
- Adds docs (`docs/payments.md`) with E2E and ngrok instructions.

Notes:
- Production-ready EasyPaisa and JazzCash require merchant credentials and exact API details; placeholders are included with TODOs.
- Webhook idempotency uses Redis (`REDIS_URL`) when configured.

## JazzCash integration notes

Endpoints to provide to JazzCash (use your real domain; your deployed frontend is at https://subtrax.vercel.app/):

- Browser return URL (customer redirect after payment):
  https://subtrax.vercel.app/payments/return/jazzcash

- Server webhook/IPN (server-to-server notifications):
  https://subtrax.vercel.app/api/payments/webhook/jazzcash

- Optional admin credential callback (for JazzCash to POST generated credentials):
  https://subtrax.vercel.app/api/admin/jazzcash/credentials

Security recommendations

- Use HTTPS only.
- Configure `JAZZCASH_WEBHOOK_SECRET` as a shared secret and provide it to JazzCash; the server will require that header (`x-jazz-auth` or `x-jazzcash-auth`) to accept webhooks when set.
- Optionally set `JAZZCASH_ALLOWED_IPS` to a comma-separated list of JazzCash IPs to further restrict sources; when set, incoming webhooks from non-allowed IPs will be rejected.
- Ensure `REDIS_URL` is set in production so webhook idempotency works.

Runtime envs

- JAZZCASH_MERCHANT_ID
- JAZZCASH_PASSWORD
- JAZZCASH_INTEGRITY_SALT
- JAZZCASH_CATEGORY_CODE (optional)
- JAZZCASH_CHECKOUT_URL (sandbox or production URL)
- JAZZCASH_WEBHOOK_SECRET (optional shared secret header value)
- JAZZCASH_ALLOWED_IPS (optional CSV of allowed addresses)

If you want I can create the admin endpoint to accept JazzCash-provided credentials and store them into Secret Manager (requires runtime SA with secretmanager.* permissions).

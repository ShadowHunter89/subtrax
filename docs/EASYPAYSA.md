EasyPaisa integration
=====================

This project includes a sandbox-friendly EasyPaisa adapter. To run in production, supply the following environment variables:

- `EASYPAYSA_API_KEY` - API key or token for merchant calls.
- `EASYPAYSA_CHECKOUT_URL` - production checkout endpoint (defaults to a sensible example).
- `EASYPAYSA_WEBHOOK_SECRET` - secret used to verify webhook HMAC signatures (recommended).

Webhook verification

The adapter will verify inbound webhooks by computing an HMAC-SHA256 over the raw payload using `EASYPAYSA_WEBHOOK_SECRET` (falls back to `EASYPAYSA_API_KEY` if webhook secret is not present). The provider's signature header is read from `x-easypaisa-signature` or `x-signature`.

Testing locally

- Without `EASYPAYSA_API_KEY`, the adapter returns a sandbox fake checkout URL for UI flows.
- To test webhook verification locally, set `EASYPAYSA_WEBHOOK_SECRET` and generate signatures with HMAC-SHA256 over the raw body.

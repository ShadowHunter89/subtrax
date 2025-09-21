// Stripe payment integration for Subtrax
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Create a Stripe Checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { price, tier, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Subtrax ${tier} Plan` },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
  success_url: (process.env.FRONTEND_BASE_URL || process.env.FRONTEND_URL || '') + '/success',
  cancel_url: (process.env.FRONTEND_BASE_URL || process.env.FRONTEND_URL || '') + '/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint for Stripe events (signature verification + idempotency)
const redis = require('./lib/redisClient');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // No webhook secret configured; parse body unsafely (only for dev/testing)
      event = req.body && JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotency: ignore events already processed (prefer Redis)
  try {
    if (redis) {
      const key = `stripe_event:${event.id}`;
      const set = await redis.set(key, '1', 'NX', 'EX', 24 * 60 * 60); // 24h TTL
      if (!set) {
        return res.status(200).send('Event already processed');
      }
    } else {
      // Fallback: no Redis configured; proceed without persistent idempotency (not recommended for prod)
    }
  } catch (err) {
    console.error('Redis idempotency check failed', err);
    // Fail closed? For now, continue to process to avoid missing events, but log prominently.
  }

  // Handle relevant events
  switch (event.type) {
    case 'checkout.session.completed':
      // handle session completed
      console.log('Checkout session completed');
      break;
    case 'invoice.payment_failed':
      console.log('Payment failed for invoice');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('Received');
});

module.exports = router;

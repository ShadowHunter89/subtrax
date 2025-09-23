const express = require('express');
const cors = require('cors');
const { admin, initialized: firebaseInitialized } = require('./firebaseAdmin');
const dotenv = require('dotenv');
const { init: initSentry } = require('./lib/sentry');

// Load environment variables
dotenv.config();

// Initialize Sentry if configured
initSentry();

// Basic env validation
const requiredEnvs = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_APP_ID'
];
const missing = requiredEnvs.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.warn('Warning: Missing required env vars:', missing.join(', '));
}

// Initialize Firebase Admin if service account is available
let db = null;
if (firebaseInitialized) {
  db = admin.firestore();
}
const app = express();
// Configure CORS in a host-agnostic way. If FRONTEND_ALLOWED_ORIGINS is set
// we'll use it as a whitelist. If FRONTEND_BASE_URL is set we'll allow that
// origin. Otherwise, allow the Origin header dynamically (convenient for
// many hosting providers) while still allowing server-to-server calls.
const { parseAllowedOrigins } = require('./lib/frontendBase');
const allowed = parseAllowedOrigins();
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (server-to-server or curl)
    if (!origin) return callback(null, true);
    // If explicit FRONTEND_BASE_URL is set, only allow that
    if (process.env.FRONTEND_BASE_URL) {
      return callback(null, origin === process.env.FRONTEND_BASE_URL);
    }
    // If a whitelist is configured, validate against it
    if (allowed.length) {
      try { const o = new URL(origin).origin || origin; return callback(null, allowed.includes(o)); } catch (_) { return callback(null, allowed.includes(origin)); }
    }
    // Default: allow the origin (host-agnostic)
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve React static files
const path = require('path');
console.log('Setting up static file serving from:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// Add test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is working', timestamp: new Date().toISOString() });
});

// Stripe webhook needs raw body, mount its router after express.json if necessary
const stripeRouter = require('./stripe');
app.use('/api/stripe', stripeRouter);
// Payments router (Paddle, EasyPaisa)
const paymentsRouter = require('./paymentsRouter');
app.use('/api/payments', paymentsRouter);
const billingRouter = require('./billingRouter');
app.use('/api/billing', billingRouter);

// New API routes
const subscriptionsRouter = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionsRouter);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const aiRouter = require('./routes/ai');
app.use('/api/ai', aiRouter);

const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

const analyticsRouter = require('./routes/analytics');
app.use('/api/analytics', analyticsRouter);

const errorsRouter = require('./routes/errors');
app.use('/api/errors', errorsRouter);

// Homepage route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Subtrax API</h1>
    <p>This is the backend service for Subtrax.</p>
    <ul>
      <li>Health check: <a href="/api/health">/api/health</a></li>
      <li>Optimize subscriptions: POST /api/optimize</li>
      <li>Payments: /api/payments</li>
      <li>Billing: /api/billing</li>
    </ul>
    <p>See README for full API documentation.</p>
  `);
});


// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    firebase: !!db,
    openai_model: process.env.OPENAI_MODEL || 'not-set'
  });
});

// Admin endpoints for token/session management (require ADMIN_API_KEY)
const adminAuth = require('./middleware/adminAuth');
// Create a custom token for a uid
app.post('/api/admin/create-custom-token', adminAuth, async (req, res) => {
  try {
    const { uid, additionalClaims } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });
    const token = await admin.auth().createCustomToken(uid, additionalClaims || {});
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create a session cookie from an ID token (for server-side sessions)
app.post('/api/admin/create-session-cookie', adminAuth, async (req, res) => {
  try {
    const { idToken, expiresIn = 60 * 60 * 24 * 5 * 1000 } = req.body; // default 5 days
    if (!idToken) return res.status(400).json({ error: 'idToken required' });
    const cookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    res.json({ cookie });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Ensure OPENAI_MODEL is available (fallback handled in code that calls OpenAI)
if (!process.env.OPENAI_MODEL) {
  console.info('OPENAI_MODEL not set, using fallback model gpt-4o-mini. Set OPENAI_MODEL to change it.');
}

// Subscription optimization endpoint (production logic)
app.post('/api/optimize', async (req, res) => {
  const { subscriptions, preferences } = req.body;
  if (!subscriptions || !Array.isArray(subscriptions)) {
    return res.status(400).json({ error: 'No subscriptions provided' });
  }
  try {
    // Convert plain objects to Subscription instances if needed
    const subObjs = subscriptions.map(sub => {
      // Parse renewalDate as Date
      return {
        ...sub,
        renewalDate: new Date(sub.renewalDate),
        isActive: function() { return this.renewalDate > new Date(); },
        getDetails: function() { return `Subscription: ${this.name}, Cost: $${this.cost}, Renewal Date: ${this.renewalDate.toDateString()}`; }
      };
    });
    // Require the optimizer lazily to avoid loading TypeScript modules at module import time
    const { SubscriptionOptimizer } = require("../src/services/subscriptionOptimizer");
    const optimizer = new SubscriptionOptimizer(subObjs);
    const optimized = optimizer.optimizeSubscriptions();
    const recommendations = optimizer.getSubscriptionRecommendations(preferences || {});
    const summary = optimizer.getSpendingSummary();
    res.json({ optimized, recommendations, summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for testing and only start server if run directly
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

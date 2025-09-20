const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
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
let firebaseInitialized = false;
try {
  // Prefer service account JSON in development; in production, use GOOGLE_APPLICATION_CREDENTIALS or env-based credentials
  const serviceAccount = require('./config/firebase.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
  firebaseInitialized = true;
} catch (err) {
  console.warn('Firebase service account not found or failed to initialize. If running in production, ensure GOOGLE_APPLICATION_CREDENTIALS or proper env-based credentials are set.');
}

let db = null;
if (firebaseInitialized) {
  db = admin.firestore();
}
const app = express();
app.use(cors());
app.use(express.json());
// Stripe webhook needs raw body, mount its router after express.json if necessary
const stripeRouter = require('./stripe');
app.use('/api/stripe', stripeRouter);


// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    firebase: firebaseInitialized,
    openai_model: process.env.OPENAI_MODEL || 'not-set'
  });
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

// Export app for testing and only start server if run directly
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

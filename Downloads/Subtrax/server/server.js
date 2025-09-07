const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('./config/firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());


// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Subscription optimization endpoint (production logic)
const { SubscriptionOptimizer } = require("../src/services/subscriptionOptimizer");

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
    const optimizer = new SubscriptionOptimizer(subObjs);
    const optimized = optimizer.optimizeSubscriptions();
    const recommendations = optimizer.getSubscriptionRecommendations(preferences || {});
    const summary = optimizer.getSpendingSummary();
    res.json({ optimized, recommendations, summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

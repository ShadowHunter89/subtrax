const express = require('express');
const { admin } = require('../firebaseAdmin');
const adminAuth = require('../middleware/adminAuth');
const userAuth = require('../middleware/userAuth');

const router = express.Router();
const db = admin.firestore();

// GET /api/subscriptions - Get user's subscriptions
router.get('/', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions');
    const snapshot = await subscriptionsRef.orderBy('createdAt', 'desc').get();
    
    const subscriptions = [];
    snapshot.forEach(doc => {
      subscriptions.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/subscriptions - Create new subscription
router.post('/', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, cost, billingCycle, category, nextBillingDate, status = 'active' } = req.body;
    
    if (!name || !cost || !billingCycle) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const subscriptionData = {
      name,
      cost: parseFloat(cost),
      billingCycle,
      category: category || 'Other',
      nextBillingDate: nextBillingDate || new Date(),
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions');
    const docRef = await subscriptionsRef.add(subscriptionData);
    
    res.json({ success: true, id: docRef.id, subscription: subscriptionData });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const subscriptionId = req.params.id;
    const updates = req.body;
    
    // Add updated timestamp
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.update(updates);
    
    res.json({ success: true, message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/subscriptions/:id - Delete subscription
router.delete('/:id', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const subscriptionId = req.params.id;
    
    const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.delete();
    
    res.json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/subscriptions/analytics - Get subscription analytics
router.get('/analytics', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions');
    const snapshot = await subscriptionsRef.get();
    
    let totalMonthly = 0;
    let totalYearly = 0;
    let activeCount = 0;
    const categories = {};
    
    snapshot.forEach(doc => {
      const sub = doc.data();
      if (sub.status === 'active') {
        activeCount++;
        const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
        totalMonthly += monthlyCost;
        totalYearly += monthlyCost * 12;
        
        categories[sub.category] = (categories[sub.category] || 0) + monthlyCost;
      }
    });
    
    res.json({
      success: true,
      analytics: {
        totalMonthly: Math.round(totalMonthly * 100) / 100,
        totalYearly: Math.round(totalYearly * 100) / 100,
        activeSubscriptions: activeCount,
        categoriesBreakdown: categories,
        averageCost: activeCount > 0 ? Math.round((totalMonthly / activeCount) * 100) / 100 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
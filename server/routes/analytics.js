const express = require('express');
const { admin, getDb } = require('../firebaseAdmin');
const userAuth = require('../middleware/userAuth');

const router = express.Router();

// GET /api/analytics/dashboard - Get user dashboard analytics
router.get('/dashboard', userAuth, async (req, res) => {
  try {
  const db = getDb();
  if (!db) return res.status(503).json({ success: false, error: 'Firebase not initialized' });
  const userId = req.user.uid;
  const { timeframe = '30d' } = req.query;
    
  // Get user's subscriptions
  const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions');
  const subscriptionsSnapshot = await subscriptionsRef.get();
    
    let totalMonthly = 0;
    let totalYearly = 0;
    let activeCount = 0;
    let cancelledCount = 0;
    const categories = {};
    const trends = {};
    
    subscriptionsSnapshot.forEach(doc => {
      const sub = doc.data();
      const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
      
      if (sub.status === 'active') {
        activeCount++;
        totalMonthly += monthlyCost;
        totalYearly += monthlyCost * 12;
        
        // Category breakdown
        categories[sub.category] = (categories[sub.category] || 0) + monthlyCost;
      } else if (sub.status === 'cancelled') {
        cancelledCount++;
      }
      
      // Monthly trends (simplified)
      const month = new Date(sub.createdAt?.toDate() || new Date()).toISOString().substr(0, 7);
      trends[month] = (trends[month] || 0) + monthlyCost;
    });
    
    // Calculate potential savings
    const potentialSavings = totalMonthly * 0.15; // Assume 15% potential savings
    
    // Get spending trends for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substr(0, 7);
      trendData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        spending: trends[monthKey] || 0
      });
    }
    
    const analytics = {
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalYearly * 100) / 100,
      activeSubscriptions: activeCount,
      cancelledSubscriptions: cancelledCount,
      potentialSavings: Math.round(potentialSavings * 100) / 100,
      averageCost: activeCount > 0 ? Math.round((totalMonthly / activeCount) * 100) / 100 : 0,
      categoriesBreakdown: categories,
      spendingTrends: trendData
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/spending - Get detailed spending analytics
router.get('/spending', userAuth, async (req, res) => {
  try {
  const db = getDb();
  if (!db) return res.status(503).json({ success: false, error: 'Firebase not initialized' });
  const userId = req.user.uid;
  const { period = 'monthly', months = 12 } = req.query;
    
  // Get subscription history
  const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions');
  const snapshot = await subscriptionsRef.get();
    
    const spendingData = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().substr(0, 7);
      
      let monthlySpending = 0;
      snapshot.forEach(doc => {
        const sub = doc.data();
        const subDate = sub.createdAt?.toDate() || new Date();
        
        if (subDate <= date && (sub.status === 'active' || sub.status === 'cancelled')) {
          if (sub.billingCycle === 'monthly') {
            monthlySpending += sub.cost;
          } else if (sub.billingCycle === 'yearly') {
            // Check if this month would have a yearly charge
            const yearsDiff = date.getFullYear() - subDate.getFullYear();
            const monthsDiff = date.getMonth() - subDate.getMonth();
            
            if (yearsDiff > 0 && monthsDiff === 0) {
              monthlySpending += sub.cost;
            } else if (yearsDiff === 0 && monthsDiff === 0) {
              monthlySpending += sub.cost;
            }
          }
        }
      });
      
      spendingData.push({
        period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        spending: Math.round(monthlySpending * 100) / 100,
        date: date.toISOString()
      });
    }
    
    res.json({ success: true, spendingData });
  } catch (error) {
    console.error('Error fetching spending analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/categories - Get category breakdown
router.get('/categories', userAuth, async (req, res) => {
  try {
  const db = getDb();
  if (!db) return res.status(503).json({ success: false, error: 'Firebase not initialized' });
  const userId = req.user.uid;
  const subscriptionsRef = db.collection('users').doc(userId).collection('subscriptions');
  const snapshot = await subscriptionsRef.where('status', '==', 'active').get();
    
    const categories = {};
    let totalSpending = 0;
    
    snapshot.forEach(doc => {
      const sub = doc.data();
      const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
      
      if (!categories[sub.category]) {
        categories[sub.category] = {
          name: sub.category,
          spending: 0,
          count: 0,
          subscriptions: []
        };
      }
      
      categories[sub.category].spending += monthlyCost;
      categories[sub.category].count += 1;
      categories[sub.category].subscriptions.push({
        id: doc.id,
        name: sub.name,
        cost: sub.cost,
        billingCycle: sub.billingCycle
      });
      
      totalSpending += monthlyCost;
    });
    
    // Calculate percentages
    const categoryData = Object.values(categories).map(cat => ({
      ...cat,
      spending: Math.round(cat.spending * 100) / 100,
      percentage: totalSpending > 0 ? Math.round((cat.spending / totalSpending) * 100) : 0
    }));
    
    res.json({ 
      success: true, 
      categories: categoryData,
      totalSpending: Math.round(totalSpending * 100) / 100
    });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analytics/track-event - Track user events
router.post('/track-event', userAuth, async (req, res) => {
  try {
  const db = getDb();
  if (!db) return res.status(503).json({ success: false, error: 'Firebase not initialized' });
  const userId = req.user.uid;
  const { event, category, label, value, metadata = {} } = req.body;
    
    if (!event) {
      return res.status(400).json({ success: false, error: 'Event name is required' });
    }
    
    const eventData = {
      userId,
      userEmail: req.user.email,
      event,
      category: category || 'user_action',
      label: label || '',
      value: value || 0,
      metadata,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      sessionId: req.headers['x-session-id'] || 'unknown'
    };
    
  await db.collection('analytics_events').add(eventData);
    
    res.json({ success: true, message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
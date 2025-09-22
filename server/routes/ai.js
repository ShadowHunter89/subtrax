const express = require('express');
const { admin } = require('../firebaseAdmin');
const userAuth = require('../middleware/userAuth');

const router = express.Router();
const db = admin.firestore();

// POST /api/ai/suggestions - Get AI-powered subscription suggestions
router.post('/suggestions', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { subscriptions = [], preferences = {} } = req.body;
    
    // Basic AI suggestions logic (can be enhanced with actual AI services)
    const suggestions = [];
    
    // Analyze subscriptions for optimization opportunities
    if (subscriptions.length > 0) {
      // Find duplicate categories
      const categoryGroups = {};
      subscriptions.forEach(sub => {
        if (!categoryGroups[sub.category]) categoryGroups[sub.category] = [];
        categoryGroups[sub.category].push(sub);
      });
      
      // Suggest consolidation for multiple subscriptions in same category
      Object.entries(categoryGroups).forEach(([category, subs]) => {
        if (subs.length > 1) {
          const totalCost = subs.reduce((sum, sub) => sum + sub.cost, 0);
          suggestions.push({
            type: 'consolidation',
            category,
            title: `Consider consolidating ${category} subscriptions`,
            description: `You have ${subs.length} ${category} subscriptions costing $${totalCost.toFixed(2)}/month. Consider switching to a bundle or premium service.`,
            potentialSavings: Math.round(totalCost * 0.2 * 100) / 100,
            priority: 'medium',
            subscriptions: subs.map(s => s.id)
          });
        }
      });
      
      // Suggest cancellation for high-cost, low-usage subscriptions
      subscriptions.forEach(sub => {
        if (sub.cost > 50 && sub.status === 'active') {
          suggestions.push({
            type: 'review',
            title: `Review ${sub.name} subscription`,
            description: `${sub.name} costs $${sub.cost}/month. Consider if you're getting enough value from this subscription.`,
            potentialSavings: sub.cost,
            priority: 'high',
            subscriptions: [sub.id]
          });
        }
      });
      
      // Suggest annual billing for monthly subscriptions
      subscriptions.filter(sub => sub.billingCycle === 'monthly' && sub.cost > 10).forEach(sub => {
        const annualSavings = sub.cost * 12 * 0.15; // Assume 15% discount for annual
        suggestions.push({
          type: 'billing_optimization',
          title: `Switch ${sub.name} to annual billing`,
          description: `Save money by switching to annual billing. Most services offer 10-20% discounts.`,
          potentialSavings: Math.round(annualSavings * 100) / 100,
          priority: 'low',
          subscriptions: [sub.id]
        });
      });
    }
    
    // Add general suggestions if no subscriptions
    if (subscriptions.length === 0) {
      suggestions.push({
        type: 'getting_started',
        title: 'Start tracking your subscriptions',
        description: 'Add your first subscription to begin optimizing your spending and discovering savings opportunities.',
        potentialSavings: 0,
        priority: 'high',
        subscriptions: []
      });
    }
    
    // Store suggestions in database for tracking
    if (suggestions.length > 0) {
      const suggestionsRef = db.collection('users').doc(userId).collection('ai_suggestions');
      const batch = db.batch();
      
      suggestions.forEach(suggestion => {
        const docRef = suggestionsRef.doc();
        batch.set(docRef, {
          ...suggestion,
          id: docRef.id,
          userId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'pending'
        });
      });
      
      await batch.commit();
    }
    
    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/ai/suggestions - Get user's AI suggestions history
router.get('/suggestions', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const suggestionsRef = db.collection('users').doc(userId).collection('ai_suggestions');
    const snapshot = await suggestionsRef.orderBy('createdAt', 'desc').limit(20).get();
    
    const suggestions = [];
    snapshot.forEach(doc => {
      suggestions.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/ai/suggestions/:id - Update suggestion status
router.put('/suggestions/:id', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const suggestionId = req.params.id;
    const { status, feedback } = req.body; // status: 'accepted', 'dismissed', 'pending'
    
    const suggestionRef = db.collection('users').doc(userId).collection('ai_suggestions').doc(suggestionId);
    const updateData = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (feedback) {
      updateData.feedback = feedback;
    }
    
    await suggestionRef.update(updateData);
    
    res.json({ success: true, message: 'Suggestion updated successfully' });
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/ai/chat - AI chat endpoint for subscription advice
router.post('/chat', userAuth, async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    
    // Simple rule-based responses (can be enhanced with actual AI)
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    if (lowerMessage.includes('save') || lowerMessage.includes('reduce')) {
      response = 'Here are some ways to save on subscriptions: 1) Switch to annual billing for discounts, 2) Cancel unused subscriptions, 3) Look for student or family discounts, 4) Use free alternatives where possible.';
    } else if (lowerMessage.includes('cancel') || lowerMessage.includes('unsubscribe')) {
      response = 'To cancel subscriptions: 1) Check your account settings on each service, 2) Contact customer support if needed, 3) Keep confirmation emails, 4) Monitor your bank statements to ensure cancellation.';
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('spend')) {
      response = 'For better subscription budgeting: 1) Set a monthly subscription limit, 2) Track all recurring charges, 3) Review subscriptions quarterly, 4) Prioritize essential vs. entertainment subscriptions.';
    } else {
      response = 'I can help you manage your subscriptions! Ask me about saving money, canceling services, budgeting, or finding alternatives to expensive subscriptions.';
    }
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
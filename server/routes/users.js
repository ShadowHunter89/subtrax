const express = require('express');
const { admin } = require('../firebaseAdmin');
const userAuth = require('../middleware/userAuth');

const router = express.Router();
const db = admin.firestore();

// GET /api/users/profile - Get user profile
router.get('/profile', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      // Create basic profile if doesn't exist
      const basicProfile = {
        uid: userId,
        email: req.user.email,
        displayName: req.user.name || 'User',
        tier: 'free',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastActive: admin.firestore.FieldValue.serverTimestamp(),
        preferences: {
          notifications: { email: true, push: false, renewalReminders: true, savingsAlerts: true },
          privacy: { analyticsOptIn: true, marketingOptIn: false },
          display: { darkMode: false, currency: 'USD', dateFormat: 'MM/DD/YYYY', timezone: 'UTC' }
        },
        metadata: {
          signupSource: 'web',
          totalSavings: 0,
          subscriptionCount: 0,
          accountStatus: 'active'
        }
      };
      
      await userRef.set(basicProfile);
      return res.json({ success: true, profile: basicProfile });
    }
    
    // Update last active
    await userRef.update({ lastActive: admin.firestore.FieldValue.serverTimestamp() });
    
    res.json({ success: true, profile: userDoc.data() });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const updates = req.body;
    
    // Don't allow updating certain fields
    delete updates.uid;
    delete updates.createdAt;
    delete updates.metadata;
    
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const userRef = db.collection('users').doc(userId);
    await userRef.update(updates);
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/users/preferences - Update user preferences
router.put('/preferences', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { preferences } = req.body;
    
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      preferences,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/upgrade - Upgrade user tier
router.post('/upgrade', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { tier } = req.body;
    
    if (!['free', 'pro', 'enterprise'].includes(tier)) {
      return res.status(400).json({ success: false, error: 'Invalid tier' });
    }
    
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      tier,
      upgradedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: `Upgraded to ${tier} tier successfully` });
  } catch (error) {
    console.error('Error upgrading user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/notifications - Get user notifications
router.get('/notifications', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const notificationsRef = db.collection('users').doc(userId).collection('notifications');
    const snapshot = await notificationsRef.orderBy('createdAt', 'desc').limit(50).get();
    
    const notifications = [];
    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/users/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const notificationId = req.params.id;
    
    const notificationRef = db.collection('users').doc(userId).collection('notifications').doc(notificationId);
    await notificationRef.update({
      read: true,
      readAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
const express = require('express');
const { admin } = require('../firebaseAdmin');

const router = express.Router();
const db = admin.firestore();

// POST /api/errors/log - Log client-side errors
router.post('/log', async (req, res) => {
  try {
    const {
      message,
      stack,
      componentStack,
      timestamp,
      userAgent,
      url,
      userId = 'anonymous'
    } = req.body;

    // Basic validation
    if (!message || !timestamp) {
      return res.status(400).json({ success: false, error: 'Message and timestamp are required' });
    }

    // Create error log entry
    const errorData = {
      message,
      stack: stack || '',
      componentStack: componentStack || '',
      timestamp: new Date(timestamp),
      userAgent: userAgent || '',
      url: url || '',
      userId,
      severity: determineSeverity(message, stack),
      resolved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ip: req.ip || req.connection.remoteAddress,
      environment: process.env.NODE_ENV || 'development'
    };

    // Store in Firestore
    await db.collection('error_logs').add(errorData);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error Logged:', {
        message,
        url,
        userId,
        timestamp
      });
    }

    res.json({ success: true, message: 'Error logged successfully' });
  } catch (error) {
    console.error('Error logging client error:', error);
    res.status(500).json({ success: false, error: 'Failed to log error' });
  }
});

// GET /api/errors - Get error logs (admin only)
router.get('/', async (req, res) => {
  try {
    // In a real app, you'd want admin authentication here
    const { limit = 50, severity, resolved, userId } = req.query;

    let query = db.collection('error_logs').orderBy('createdAt', 'desc');

    // Apply filters
    if (severity) {
      query = query.where('severity', '==', severity);
    }
    if (resolved !== undefined) {
      query = query.where('resolved', '==', resolved === 'true');
    }
    if (userId) {
      query = query.where('userId', '==', userId);
    }

    const snapshot = await query.limit(parseInt(limit)).get();
    
    const errors = [];
    snapshot.forEach(doc => {
      errors.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, errors });
  } catch (error) {
    console.error('Error fetching error logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch error logs' });
  }
});

// PUT /api/errors/:id/resolve - Mark error as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const errorId = req.params.id;
    const { resolvedBy, resolution } = req.body;

    await db.collection('error_logs').doc(errorId).update({
      resolved: true,
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
      resolvedBy: resolvedBy || 'system',
      resolution: resolution || 'Fixed'
    });

    res.json({ success: true, message: 'Error marked as resolved' });
  } catch (error) {
    console.error('Error resolving error log:', error);
    res.status(500).json({ success: false, error: 'Failed to resolve error' });
  }
});

// GET /api/errors/stats - Get error statistics
router.get('/stats', async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get error logs in timeframe
    const snapshot = await db.collection('error_logs')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', now)
      .get();

    const stats = {
      total: 0,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      byDay: {},
      topErrors: {},
      resolved: 0,
      unresolved: 0
    };

    snapshot.forEach(doc => {
      const error = doc.data();
      stats.total++;
      
      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      
      // Count by day
      const day = error.timestamp.toDate().toISOString().split('T')[0];
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
      
      // Count top errors
      const errorKey = error.message.substring(0, 100); // First 100 chars
      stats.topErrors[errorKey] = (stats.topErrors[errorKey] || 0) + 1;
      
      // Count resolved/unresolved
      if (error.resolved) {
        stats.resolved++;
      } else {
        stats.unresolved++;
      }
    });

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching error stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch error stats' });
  }
});

// Helper function to determine error severity
function determineSeverity(message, stack) {
  const lowerMessage = message.toLowerCase();
  const lowerStack = (stack || '').toLowerCase();
  
  // Critical errors
  if (lowerMessage.includes('security') || 
      lowerMessage.includes('payment') ||
      lowerMessage.includes('auth') ||
      lowerStack.includes('security')) {
    return 'critical';
  }
  
  // High severity
  if (lowerMessage.includes('cannot read') ||
      lowerMessage.includes('undefined') ||
      lowerMessage.includes('null') ||
      lowerMessage.includes('network')) {
    return 'high';
  }
  
  // Medium severity
  if (lowerMessage.includes('warning') ||
      lowerMessage.includes('deprecated')) {
    return 'medium';
  }
  
  // Default to low
  return 'low';
}

module.exports = router;
const express = require('express');
const { admin } = require('../firebaseAdmin');
const userAuth = require('../middleware/userAuth');

const router = express.Router();
const db = admin.firestore();

// POST /api/contact - Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message, subject = 'General Inquiry' } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    // Store contact submission
    const contactData = {
      name,
      email,
      message,
      subject,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      source: 'website'
    };
    
    const contactRef = await db.collection('contact_submissions').add(contactData);
    
    // Create notification for admins
    const adminNotification = {
      type: 'new_contact',
      title: 'New Contact Form Submission',
      message: `${name} (${email}) submitted: ${subject}`,
      data: { contactId: contactRef.id },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    };
    
    await db.collection('admin_notifications').add(adminNotification);
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message. We\'ll get back to you soon!',
      id: contactRef.id 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ success: false, error: 'Failed to submit message' });
  }
});

// POST /api/contact/newsletter - Newsletter subscription
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name = '' } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    
    // Check if already subscribed
    const existingRef = db.collection('newsletter_subscribers').where('email', '==', email);
    const existingSnapshot = await existingRef.get();
    
    if (!existingSnapshot.empty) {
      return res.json({ success: true, message: 'You are already subscribed to our newsletter!' });
    }
    
    // Add to newsletter subscribers
    const subscriberData = {
      email,
      name,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
      source: 'website'
    };
    
    await db.collection('newsletter_subscribers').add(subscriberData);
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to our newsletter!' 
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
});

// POST /api/contact/feedback - User feedback
router.post('/feedback', userAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { rating, category, message, features = [] } = req.body;
    
    if (!rating || !message) {
      return res.status(400).json({ success: false, error: 'Rating and message are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }
    
    const feedbackData = {
      userId,
      userEmail: req.user.email,
      rating,
      category: category || 'general',
      message,
      features,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    };
    
    const feedbackRef = await db.collection('user_feedback').add(feedbackData);
    
    // Update user's total feedback count
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      'metadata.feedbackCount': admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your feedback!',
      id: feedbackRef.id 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// GET /api/contact/faq - Get frequently asked questions
router.get('/faq', async (req, res) => {
  try {
    const faqRef = db.collection('faq').where('published', '==', true).orderBy('order');
    const snapshot = await faqRef.get();
    
    const faqs = [];
    snapshot.forEach(doc => {
      faqs.push({ id: doc.id, ...doc.data() });
    });
    
    // Default FAQs if none in database
    if (faqs.length === 0) {
      const defaultFaqs = [
        {
          question: 'How does Subtrax work?',
          answer: 'Subtrax helps you track and manage all your subscriptions in one place. Add your subscriptions, get AI-powered recommendations, and optimize your spending.',
          category: 'general'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes! We use bank-level encryption and never store sensitive payment information. All data is encrypted in transit and at rest.',
          category: 'security'
        },
        {
          question: 'Which payment methods are supported?',
          answer: 'We support JazzCash, EasyPaisa, bank transfers, and credit/debit cards through secure local gateways.',
          category: 'payments'
        },
        {
          question: 'Can I cancel anytime?',
          answer: 'Absolutely! You can cancel your subscription at any time. No hidden fees or cancellation charges.',
          category: 'billing'
        },
        {
          question: 'Do you offer customer support?',
          answer: 'Yes, we provide email support and live chat during business hours. Premium users get priority support.',
          category: 'support'
        }
      ];
      
      return res.json({ success: true, faqs: defaultFaqs });
    }
    
    res.json({ success: true, faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch FAQs' });
  }
});

module.exports = router;
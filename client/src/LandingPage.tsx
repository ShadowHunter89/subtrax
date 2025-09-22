import React, { useState } from 'react';
import './styles.css';

interface LandingPageProps {
  onNavigate: (section: string) => void;
}

interface Testimonial {
  name: string;
  review: string;
  avatar: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    review: "The best financial tracking tool I've ever used! Clean interface and powerful features.",
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Sarah",
  },
  {
    name: "Ahmed K.",
    review: "Finally, a Pakistani payment solution that actually works seamlessly. Highly recommended!",
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Ahmed",
  },
  {
    name: "Fatima R.",
    review: "The analytics insights have completely changed how I manage my subscription business.",
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Fatima",
  },
];

const faqs: FAQ[] = [
  {
    question: "Is my financial data secure?",
    answer: "Yes! We use bank-level encryption and never store sensitive payment information. All data is encrypted in transit and at rest.",
  },
  {
    question: "Which Pakistani payment methods are supported?",
    answer: "We support JazzCash, EasyPaisa, bank transfers, and credit/debit cards through secure local gateways.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! You can cancel your subscription at any time. No hidden fees or cancellation charges.",
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes, we provide email support and live chat during business hours. Premium users get priority support.",
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="content-container">
          <div className="nav-container">
            <div className="landing-logo">Subtrax</div>
            <div className="landing-nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#testimonials" className="nav-link">Reviews</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-header">
        <div className="content-container">
          <h1 className="landing-hero-title">
            Pakistani Subscription Management Made Simple
          </h1>
          <p className="landing-hero-subtitle">
            Track, manage, and optimize your subscriptions with Pakistan's most trusted platform. 
            Supports JazzCash, EasyPaisa, and all major local payment methods.
          </p>
          <a href="#pricing" className="landing-hero-cta">
            Start Free Trial
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="landing-section features-section">
        <div className="content-container">
          <h2 className="section-title">Powerful Features Built for Pakistan</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Multi-Platform Access</h3>
              <p className="feature-description">
                Access your subscription data from web, mobile, or tablet. Synchronized across all devices.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Pakistani Payment Support</h3>
              <p className="feature-description">
                Native support for JazzCash, EasyPaisa, and local banking systems with PKR currency.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Smart Analytics</h3>
              <p className="feature-description">
                AI-powered insights to optimize your subscription spending and identify cost savings.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Bank-Level Security</h3>
              <p className="feature-description">
                End-to-end encryption with compliance to Pakistani financial regulations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-Time Notifications</h3>
              <p className="feature-description">
                Get instant alerts for renewals, price changes, and payment failures.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Business Insights</h3>
              <p className="feature-description">
                Track subscriber growth, churn rates, and revenue trends for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="landing-section pricing-section">
        <div className="content-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="pricing-container">
            <div className="pricing-card pricing-card-free">
              <h3 className="pricing-title">Free</h3>
              <div className="pricing-price">PKR 0<span className="pricing-period">/month</span></div>
              <ul className="pricing-features">
                <li>Up to 5 subscriptions</li>
                <li>Basic analytics</li>
                <li>Email support</li>
                <li>Mobile app access</li>
              </ul>
              <button 
                className="pricing-button" 
                onClick={() => onNavigate('auth')}
              >
                Get Started Free
              </button>
            </div>
            <div className="pricing-card pricing-card-pro">
              <h3 className="pricing-title">Professional</h3>
              <div className="pricing-price">PKR 1,500<span className="pricing-period">/month</span></div>
              <ul className="pricing-features">
                <li>Unlimited subscriptions</li>
                <li>Advanced analytics & insights</li>
                <li>Priority support</li>
                <li>API access</li>
                <li>Team collaboration</li>
                <li>Custom reports</li>
              </ul>
              <button 
                className="pricing-button" 
                onClick={() => onNavigate('billing')}
              >
                Start Pro Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="landing-section testimonials-section">
        <div className="content-container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <p className="testimonial-review">"{testimonial.review}"</p>
                <h4 className="testimonial-name">- {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="landing-section faq-section">
        <div className="content-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="landing-section newsletter-section">
        <div className="content-container">
          <h2 className="section-title">Stay Updated</h2>
          <p className="newsletter-description">
            Get the latest features and Pakistani fintech news delivered to your inbox.
          </p>
          {!subscribed ? (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          ) : (
            <p className="subscription-success">
              ✅ Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">Subtrax</h3>
              <p className="footer-description">
                Pakistan's leading subscription management platform
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-column-title">Product</h4>
                <a href="#features" className="footer-link">Features</a>
                <a href="#pricing" className="footer-link">Pricing</a>
                <button 
                  className="footer-link" 
                  onClick={() => onNavigate('help')}
                >
                  Help Center
                </button>
              </div>
              <div className="footer-column">
                <h4 className="footer-column-title">Company</h4>
                <button 
                  className="footer-link" 
                  onClick={() => onNavigate('about')}
                >
                  About Us
                </button>
                <button 
                  className="footer-link" 
                  onClick={() => onNavigate('privacy')}
                >
                  Privacy Policy
                </button>
                <button 
                  className="footer-link" 
                  onClick={() => onNavigate('terms')}
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Subtrax. All rights reserved. Made with ❤️ in Pakistan 🇵🇰</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
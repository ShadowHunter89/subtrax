
import React, { useState } from "react";
import "./styles.css";

const accent = "#7F5AF0";
const bg = "#16161a";
const text = "#fffffe";
const highlight = "#2cb67d";
const muted = "#94a1b2";

const testimonials = [
  {
    name: "Ayesha K.",
    quote: "Subtrax helped me save $30/month and discover new deals! The dashboard is a game changer.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Omar R.",
    quote: "I love the AI suggestions. I never realized how much I was overspending on subscriptions.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Fatima S.",
    quote: "The payment integrations are seamless. Subtrax is now my go-to for managing subscriptions.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const faqs = [
  {
    q: "How does Subtrax optimize my subscriptions?",
    a: "We use AI to analyze your usage and spending, then suggest ways to save or discover better deals."
  },
  {
    q: "Is my data secure?",
    a: "Yes, we use industry-standard encryption and never share your data without consent."
  },
  {
    q: "Can I use Subtrax for business subscriptions?",
    a: "Absolutely! Our dashboard works for individuals and businesses alike."
  }
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 4rem", background: accent, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, fontSize: "2rem", color: text }}>Subtrax</span>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <a href="#features" style={{ color: text, textDecoration: "none" }}>Features</a>
          <a href="#pricing" style={{ color: text, textDecoration: "none" }}>Pricing</a>
          <a href="#testimonials" style={{ color: text, textDecoration: "none" }}>Testimonials</a>
          <a href="#faq" style={{ color: text, textDecoration: "none" }}>FAQ</a>
          <a href="#contact" style={{ color: text, textDecoration: "none" }}>Contact</a>
        </div>
      </nav>
      <header style={{ textAlign: "center", padding: "6rem 2rem 3rem 2rem", position: "relative" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, color: accent, marginBottom: "1rem", letterSpacing: "-2px", animation: "fadeIn 1.5s" }}>
          Optimize Your Subscriptions
        </h1>
        <p style={{ fontSize: "1.5rem", color: muted, margin: "2rem 0", animation: "fadeIn 2s" }}>
          Save money, discover new deals, and manage all your subscriptions in one place.
        </p>
        <a href="#signup" style={{ background: highlight, color: bg, padding: "1rem 2.5rem", borderRadius: "2rem", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none", boxShadow: "0 4px 24px #2cb67d55", animation: "fadeIn 2.5s" }}>
          Get Started Free
        </a>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -1 }}>
          <svg width="100%" height="100" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: "-40px" }}>
            <path d="M0,40 C480,120 960,-40 1440,40 L1440,100 L0,100 Z" fill={accent} opacity="0.15" />
          </svg>
        </div>
      </header>
      <section id="features" style={{ padding: "4rem 2rem", background: accent, color: text }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Features</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: "2rem 0", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
          <li style={{ background: bg, color: text, borderRadius: "1rem", padding: "2rem", minWidth: "220px", boxShadow: "0 2px 12px #7F5AF055" }}>
            <strong>Smart Optimization</strong><br />AI-powered suggestions to reduce costs.
          </li>
          <li style={{ background: bg, color: text, borderRadius: "1rem", padding: "2rem", minWidth: "220px", boxShadow: "0 2px 12px #7F5AF055" }}>
            <strong>Personalized Dashboard</strong><br />Track all your subscriptions in one place.
          </li>
          <li style={{ background: bg, color: text, borderRadius: "1rem", padding: "2rem", minWidth: "220px", boxShadow: "0 2px 12px #7F5AF055" }}>
            <strong>Payment Integration</strong><br />Supports Stripe, JazzCash, EasyPaisa, and more.
          </li>
          <li style={{ background: bg, color: text, borderRadius: "1rem", padding: "2rem", minWidth: "220px", boxShadow: "0 2px 12px #7F5AF055" }}>
            <strong>Host-Agnostic</strong><br />Works on Render, Vercel, Netlify, and more.
          </li>
        </ul>
      </section>
      <section id="pricing" style={{ padding: "4rem 2rem", background: bg, color: text }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: accent }}>Pricing</h2>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
          <div style={{ background: accent, color: text, borderRadius: "1rem", padding: "2rem 3rem", minWidth: "220px", boxShadow: "0 2px 12px #7F5AF055" }}>
            <strong>Free</strong><br />Basic optimization & dashboard<br /><span style={{ fontWeight: 700, fontSize: "1.5rem" }}>$0</span>
          </div>
          <div style={{ background: highlight, color: bg, borderRadius: "1rem", padding: "2rem 3rem", minWidth: "220px", boxShadow: "0 2px 12px #2cb67d55" }}>
            <strong>Pro</strong><br />Advanced AI, integrations, priority support<br /><span style={{ fontWeight: 700, fontSize: "1.5rem" }}>$9/mo</span>
          </div>
        </div>
      </section>
      <section id="testimonials" style={{ padding: "4rem 2rem", background: accent, color: text }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center" }}>What Our Users Say</h2>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: bg, color: text, borderRadius: "1rem", padding: "2rem", minWidth: "260px", maxWidth: "320px", boxShadow: "0 2px 12px #7F5AF055", textAlign: "center" }}>
              <img src={t.avatar} alt={t.name} style={{ width: "64px", height: "64px", borderRadius: "50%", marginBottom: "1rem" }} />
              <blockquote style={{ fontStyle: "italic", marginBottom: "1rem" }}>
                "{t.quote}"
              </blockquote>
              <span style={{ fontWeight: 700 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </section>
      <section id="faq" style={{ padding: "4rem 2rem", background: bg, color: text }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: accent, textAlign: "center" }}>FAQ</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginTop: "2rem" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: accent, color: text, borderRadius: "1rem", padding: "2rem", minWidth: "260px", maxWidth: "320px", boxShadow: "0 2px 12px #7F5AF055" }}>
              <strong>{f.q}</strong>
              <p style={{ color: muted, marginTop: "1rem" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="newsletter" style={{ padding: "4rem 2rem", background: accent, color: text, textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Stay Updated</h2>
        <form onSubmit={handleSubscribe} style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            style={{ padding: "1rem", borderRadius: "2rem", border: "none", minWidth: "220px", fontSize: "1rem" }}
          />
          <button type="submit" style={{ background: highlight, color: bg, padding: "1rem 2rem", borderRadius: "2rem", fontWeight: 700, fontSize: "1rem", border: "none", boxShadow: "0 2px 12px #2cb67d55" }}>
            Subscribe
          </button>
        </form>
        {subscribed && <p style={{ color: bg, background: highlight, display: "inline-block", padding: "0.5rem 1rem", borderRadius: "1rem", marginTop: "1rem" }}>Thank you for subscribing!</p>}
      </section>
      <section id="contact" style={{ padding: "4rem 2rem", background: accent, color: text, textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Contact Us</h2>
        <p style={{ color: muted }}>Questions? Email <a href="mailto:support@subtrax.app" style={{ color: highlight }}>support@subtrax.app</a></p>
        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem" }}>
          <a href="https://twitter.com/subtraxapp" target="_blank" rel="noopener noreferrer" style={{ color: text, fontSize: "2rem" }}>
            <span role="img" aria-label="Twitter">🐦</span>
          </a>
          <a href="https://facebook.com/subtraxapp" target="_blank" rel="noopener noreferrer" style={{ color: text, fontSize: "2rem" }}>
            <span role="img" aria-label="Facebook">📘</span>
          </a>
          <a href="https://instagram.com/subtraxapp" target="_blank" rel="noopener noreferrer" style={{ color: text, fontSize: "2rem" }}>
            <span role="img" aria-label="Instagram">📸</span>
          </a>
        </div>
      </section>
      <footer style={{ background: bg, color: muted, textAlign: "center", padding: "2rem" }}>
        &copy; {new Date().getFullYear()} Subtrax. All rights reserved.
      </footer>
      <style>{`
        @media (max-width: 800px) {
          nav, header, section, footer { padding: 1.5rem !important; }
          h1 { font-size: 2.2rem !important; }
          h2 { font-size: 1.3rem !important; }
          ul, div { flex-direction: column !important; gap: 1rem !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

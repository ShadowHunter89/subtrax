import React from "react";

const accent = "#7F5AF0";
const bg = "#16161a";
const text = "#fffffe";
const highlight = "#2cb67d";
const muted = "#94a1b2";

export default function LandingPage() {
  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 4rem", background: accent }}>
        <span style={{ fontWeight: 700, fontSize: "2rem", color: text }}>Subtrax</span>
        <div>
          <a href="#features" style={{ color: text, marginRight: "2rem", textDecoration: "none" }}>Features</a>
          <a href="#pricing" style={{ color: text, marginRight: "2rem", textDecoration: "none" }}>Pricing</a>
          <a href="#contact" style={{ color: text, textDecoration: "none" }}>Contact</a>
        </div>
      </nav>
      <header style={{ textAlign: "center", padding: "6rem 2rem 3rem 2rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, color: accent }}>Optimize Your Subscriptions</h1>
        <p style={{ fontSize: "1.5rem", color: muted, margin: "2rem 0" }}>
          Save money, discover new deals, and manage all your subscriptions in one place.
        </p>
        <a href="#signup" style={{ background: highlight, color: bg, padding: "1rem 2.5rem", borderRadius: "2rem", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none", boxShadow: "0 4px 24px #2cb67d55" }}>
          Get Started Free
        </a>
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
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem" }}>
          <div style={{ background: accent, color: text, borderRadius: "1rem", padding: "2rem 3rem", minWidth: "220px", boxShadow: "0 2px 12px #7F5AF055" }}>
            <strong>Free</strong><br />Basic optimization & dashboard<br /><span style={{ fontWeight: 700, fontSize: "1.5rem" }}>$0</span>
          </div>
          <div style={{ background: highlight, color: bg, borderRadius: "1rem", padding: "2rem 3rem", minWidth: "220px", boxShadow: "0 2px 12px #2cb67d55" }}>
            <strong>Pro</strong><br />Advanced AI, integrations, priority support<br /><span style={{ fontWeight: 700, fontSize: "1.5rem" }}>$9/mo</span>
          </div>
        </div>
      </section>
      <section id="contact" style={{ padding: "4rem 2rem", background: accent, color: text, textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>Contact Us</h2>
        <p style={{ color: muted }}>Questions? Email <a href="mailto:support@subtrax.app" style={{ color: highlight }}>support@subtrax.app</a></p>
      </section>
      <footer style={{ background: bg, color: muted, textAlign: "center", padding: "2rem" }}>
        &copy; {new Date().getFullYear()} Subtrax. All rights reserved.
      </footer>
    </div>
  );
}

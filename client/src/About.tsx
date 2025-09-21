import React from "react";

export default function About() {
  return (
    <div style={{ padding: "3rem", maxWidth: 800, margin: "auto", color: "#16161a", background: "#fffffe", borderRadius: "1rem", boxShadow: "0 2px 12px #7F5AF055" }}>
      <h1 style={{ color: "#7F5AF0" }}>About Subtrax</h1>
      <p>Subtrax is a modern SaaS platform designed to help users optimize, manage, and save on their subscriptions. Our mission is to empower individuals and businesses to take control of their recurring expenses with AI-powered insights and seamless integrations.</p>
      <ul>
        <li>Founded in 2025</li>
        <li>Supports global and local payment gateways</li>
        <li>Host-agnostic: works on Render, Vercel, Netlify, and more</li>
        <li>Secure, privacy-focused, and user-friendly</li>
      </ul>
      <p>Contact us at support@subtrax.app for more information.</p>
    </div>
  );
}

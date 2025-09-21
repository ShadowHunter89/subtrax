import React from "react";
import "./styles.css";

export default function About() {
  return (
    <div className="page-container">
      <h1 className="page-title">About Subtrax</h1>
      <div className="page-content">
        <p>Subtrax is a modern SaaS platform designed to help users optimize, manage, and save on their subscriptions. Our mission is to empower individuals and businesses to take control of their recurring expenses with AI-powered insights and seamless integrations.</p>
        <ul>
          <li>Founded in 2025</li>
          <li>Supports global and local payment gateways</li>
          <li>Host-agnostic: works on Render, Vercel, Netlify, and more</li>
          <li>Secure, privacy-focused, and user-friendly</li>
        </ul>
        <p>Contact us at support@subtrax.app for more information.</p>
      </div>
    </div>
  );
}

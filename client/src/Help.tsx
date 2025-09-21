import React from "react";

export default function Help() {
  return (
    <div style={{ padding: "3rem", maxWidth: 800, margin: "auto", color: "#16161a", background: "#fffffe", borderRadius: "1rem", boxShadow: "0 2px 12px #7F5AF055" }}>
      <h1 style={{ color: "#7F5AF0" }}>Help & Support</h1>
      <p>Need help with Subtrax? Here are some common resources:</p>
      <ul>
        <li>FAQ section on the landing page</li>
        <li>Email support: <a href="mailto:support@subtrax.app">support@subtrax.app</a></li>
        <li>Live chat (coming soon)</li>
        <li>API documentation (see README)</li>
      </ul>
      <p>We're here to help you get the most out of Subtrax!</p>
    </div>
  );
}

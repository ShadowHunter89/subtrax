import React from "react";
import "./styles.css";

export default function Help() {
  return (
    <div className="page-container">
      <h1 className="page-title">Help & Support</h1>
      <div className="page-content">
        <p>Need help with Subtrax? Here are some common resources:</p>
        <ul>
          <li>FAQ section on the landing page</li>
          <li>Email support: <a href="mailto:support@subtrax.app">support@subtrax.app</a></li>
          <li>Live chat (coming soon)</li>
          <li>API documentation (see README)</li>
        </ul>
        <p>We're here to help you get the most out of Subtrax!</p>
      </div>
    </div>
  );
}

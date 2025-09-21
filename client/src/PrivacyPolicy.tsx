import React from "react";

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: "3rem", maxWidth: 800, margin: "auto", color: "#16161a", background: "#fffffe", borderRadius: "1rem", boxShadow: "0 2px 12px #7F5AF055" }}>
      <h1 style={{ color: "#7F5AF0" }}>Privacy Policy</h1>
      <p>Your privacy is important to us. Subtrax collects only the data necessary to provide our services and never sells or shares your data without consent.</p>
      <ul>
        <li>We use encryption to protect your information.</li>
        <li>Subscription and payment data is stored securely.</li>
        <li>You can request data deletion at any time.</li>
        <li>We comply with GDPR and other privacy regulations.</li>
        <li>Contact support@subtrax.app for privacy questions.</li>
      </ul>
      <p>By using Subtrax, you agree to this privacy policy.</p>
    </div>
  );
}

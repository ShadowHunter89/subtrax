import React from "react";

export default function TermsAndConditions() {
  return (
    <div style={{ padding: "3rem", maxWidth: 800, margin: "auto", color: "#16161a", background: "#fffffe", borderRadius: "1rem", boxShadow: "0 2px 12px #7F5AF055" }}>
      <h1 style={{ color: "#7F5AF0" }}>Terms & Conditions</h1>
      <p>Welcome to Subtrax! By using our service, you agree to the following terms and conditions:</p>
      <ul>
        <li>Use Subtrax for lawful purposes only.</li>
        <li>Do not share your account credentials.</li>
        <li>We reserve the right to update these terms at any time.</li>
        <li>All subscription data is kept confidential and secure.</li>
        <li>Payments and billing are handled via secure third-party providers.</li>
        <li>For full details, contact support@subtrax.app.</li>
      </ul>
      <p>By continuing to use Subtrax, you acknowledge and accept these terms.</p>
    </div>
  );
}

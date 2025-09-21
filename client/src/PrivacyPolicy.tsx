import React from "react";
import "./styles.css";

export default function PrivacyPolicy() {
  return (
    <div className="page-container">
      <h1 className="page-title">Privacy Policy</h1>
      <div className="page-content">
        <p>Your privacy is important to us. Subtrax collects only the data necessary to provide our services and never sells or shares your data without consent.</p>
        <ul>
          <li>We use encryption to protect your information.</li>
          <li>Subscription and payment data is stored securely.</li>
          <li>We comply with GDPR and other privacy regulations.</li>
          <li>We never sell your data to third parties.</li>
          <li>You can request data deletion at any time.</li>
        </ul>
        <p>For questions, contact us at privacy@subtrax.app.</p>
      </div>
    </div>
  );
}

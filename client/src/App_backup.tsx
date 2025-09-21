

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./LandingPage";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import About from "./About";
import Help from "./Help";
import AuthDemo from "./AuthDemo";
import SubscriptionDashboard from "./SubscriptionDashboard";

const navStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "2rem",
  background: "#7F5AF0",
  padding: "1rem",
  fontWeight: 700,
  fontSize: "1.1rem"
};

const linkStyle = {
  color: "#fffffe",
  textDecoration: "none"
};

const App: React.FC = () => {
  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/about" style={linkStyle}>About</Link>
        <Link to="/help" style={linkStyle}>Help</Link>
        <Link to="/terms" style={linkStyle}>Terms</Link>
        <Link to="/privacy" style={linkStyle}>Privacy</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<><AuthDemo /><SubscriptionDashboard /></>} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;

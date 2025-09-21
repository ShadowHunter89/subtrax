
import React from "react";
import { Container, Typography } from "@mui/material";
import AuthDemo from "./AuthDemo";
import SubscriptionDashboard from "./SubscriptionDashboard";

const App: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Subtrax Subscription Optimizer
      </Typography>
  <AuthDemo />
  <SubscriptionDashboard />
    </Container>
  );
};

export default App;

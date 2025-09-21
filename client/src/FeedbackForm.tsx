
import React, { useState } from "react";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("Please enter your feedback.");
      return;
    }
    // In production, send to backend or analytics service
    setSuccess(true);
    setFeedback("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={4}>
      <TextField
        label="Your Feedback"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="outlined">Send Feedback</Button>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Thank you for your feedback!
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}> 
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackForm;

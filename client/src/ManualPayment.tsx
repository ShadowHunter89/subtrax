import React, { useState } from "react";
import { Box, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";

const ManualPayment: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !screenshot) {
      setError("Please fill all fields and upload payment proof.");
      return;
    }
    // In production, send to backend for admin approval
    setSuccess(true);
    setName("");
    setEmail("");
    setScreenshot(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2}>
      <Typography variant="subtitle1">Manual Payment (Pakistan)</Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Send payment to JazzCash/Easypaisa: <b>03xx-xxxxxxx</b> or bank account <b>XXXX-XXXX</b>.<br />
        Upload a screenshot of your payment below. Our team will verify and activate your subscription.
      </Typography>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{ mb: 1 }} />
      <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 1 }} />
      <Button variant="outlined" component="label" sx={{ mb: 1 }}>
        Upload Screenshot
        <input type="file" hidden accept="image/*" onChange={e => setScreenshot(e.target.files?.[0] || null)} />
      </Button>
      {screenshot && <Typography variant="caption">{screenshot.name}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit for Approval</Button>
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Payment submitted! We will verify and notify you soon.
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}> 
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ManualPayment;

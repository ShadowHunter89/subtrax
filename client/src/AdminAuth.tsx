import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";

const AdminAuth: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // In production, check for admin claim
      onAuth();
    } catch (err) {
      setError("Invalid credentials or not an admin.");
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} mt={4}>
      <Typography variant="h6">Admin Login</Typography>
      <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 1 }} />
      <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 1 }} />
      <Button type="submit" variant="contained">Login</Button>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminAuth;

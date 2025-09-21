import React, { useState } from "react";
import { Container, Typography, Button, TextField, Box } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthDemo: React.FC = () => {
  const [user, setUser] = useState(() => auth.currentUser);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      alert("Sign in failed");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Box mt={4}>
      {user ? (
        <>
          <Typography>Welcome, {user.displayName || user.email}!</Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ mt: 2 }}>
            Sign Out
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
      )}
    </Box>
  );
};

export default AuthDemo;

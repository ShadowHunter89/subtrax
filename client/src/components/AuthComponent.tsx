import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { useAuth } from './contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AuthComponent({ onSuccess }: { onSuccess?: () => void }) {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { login, signup, resetPassword, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (tab === 0) {
        // Login
        await login(email, password);
        setMessage('Successfully logged in!');
        onSuccess?.();
      } else if (tab === 1) {
        // Signup
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await signup(email, password, displayName);
        setMessage('Account created successfully!');
        onSuccess?.();
      } else {
        // Reset password
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setMessage('Successfully signed in with Google!');
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError('');
    setMessage('');
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="auth tabs">
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
          <Tab label="Reset Password" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit}>
        <TabPanel value={tab} index={0}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to access your subscription dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center">
            <Link
              component="button"
              type="button"
              onClick={() => setTab(2)}
              underline="hover"
            >
              Forgot your password?
            </Link>
          </Box>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join Subtrax and start optimizing your subscriptions
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            helperText="At least 6 characters"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Sign up with Google
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => setTab(0)}
                underline="hover"
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => setTab(0)}
                underline="hover"
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </TabPanel>
      </form>
    </Card>
  );
}
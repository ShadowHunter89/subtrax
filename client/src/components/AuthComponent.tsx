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
import { useAuth } from '../contexts/AuthContext';
import '../styles.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AuthComponentProps {
  onSuccess?: () => void;
}

interface CustomAlertProps {
  severity: 'error' | 'success';
  children: React.ReactNode;
}

function CustomAlert({ severity, children }: CustomAlertProps) {
  return (
    <div className={`auth-alert ${severity}`}>
      {children}
    </div>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      className="auth-tab-panel"
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function AuthComponent({ onSuccess }: AuthComponentProps) {
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
    <div className="auth-container">
      <div className="auth-tabs">
        <Tabs value={tab} onChange={handleTabChange} aria-label="auth tabs">
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
          <Tab label="Reset Password" />
        </Tabs>
      </div>

      <form onSubmit={handleSubmit}>
        <TabPanel value={tab} index={0}>
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to access your subscription dashboard
            </p>
          </div>

          {error && (
            <CustomAlert severity="error">
              {error}
            </CustomAlert>
          )}
          {message && (
            <CustomAlert severity="success">
              {message}
            </CustomAlert>
          )}

          <div className="auth-form">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-field"
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
              className="auth-field"
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
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Google />
              Continue with Google
            </button>

            <div className="auth-link-section">
              <button
                type="button"
                className="auth-link"
                onClick={() => setTab(2)}
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join Subtrax and start optimizing your subscriptions
            </p>
          </div>

          {error && (
            <CustomAlert severity="error">
              {error}
            </CustomAlert>
          )}
          {message && (
            <CustomAlert severity="success">
              {message}
            </CustomAlert>
          )}

          <div className="auth-form">
            <TextField
              fullWidth
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="auth-field"
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
              className="auth-field"
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
              helperText="At least 6 characters"
              className="auth-field"
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
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              className="auth-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Google />
              Sign up with Google
            </button>

            <div className="auth-link-section">
              <p className="auth-subtitle">
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setTab(0)}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <div className="auth-header">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {error && (
            <CustomAlert severity="error">
              {error}
            </CustomAlert>
          )}
          {message && (
            <CustomAlert severity="success">
              {message}
            </CustomAlert>
          )}

          <div className="auth-form">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>

            <div className="auth-link-section">
              <p className="auth-subtitle">
                Remember your password?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setTab(0)}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </TabPanel>
      </form>
    </div>
  );
}
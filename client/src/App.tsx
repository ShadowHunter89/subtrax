
// Modern App component with comprehensive routing and authentication
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles, Box } from '@mui/material';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthComponent from './components/AuthComponent';
import EnhancedDashboard from './components/EnhancedDashboard';
import PaymentIntegration from './components/PaymentIntegration';
import ModernLandingPage from './components/ModernLandingPage';
import TermsAndConditions from './TermsAndConditions';
import PrivacyPolicy from './PrivacyPolicy';
import About from './About';
import Help from './Help';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ContactForm from './components/ContactForm';
import UserSettingsPage from './components/UserSettingsPage';
import NotificationSystem from './components/NotificationSystem';
import CurrencyConverter from './components/CurrencyConverter';
import SubscriptionAnalytics from './components/SubscriptionAnalytics';
import ApiTestingDashboard from './components/ApiTestingDashboard';
import { validateEnvironment } from './utils/envValidator';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7F5AF0',
      light: '#9D7BF7',
      dark: '#6B47E8',
    },
    secondary: {
      main: '#2CB67D',
      light: '#4CC490',
      dark: '#1F9A65',
    },
    background: {
      default: '#FFFFFE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#242629',
      secondary: '#94A1B2',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Global styles
const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        transition: 'all 0.2s ease-in-out',
      },
      html: {
        height: '100%',
      },
      body: {
        height: '100%',
        backgroundColor: theme.palette.background.default,
        fontFamily: theme.typography.fontFamily,
      },
      '#root': {
        height: '100%',
        minHeight: '100vh',
      },
      // Custom scrollbar
      '::-webkit-scrollbar': {
        width: 8,
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: 4,
      },
      '::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: 4,
        opacity: 0.6,
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.primary.dark,
        opacity: 0.8,
      },
    }}
  />
);

const App: React.FC = () => {
  // Validate environment variables on app start
  useEffect(() => {
    const { isValid } = validateEnvironment();
    if (!isValid && process.env.NODE_ENV === 'development') {
      // In development, we want to know about missing env vars
      // In production, the app should handle missing optional vars gracefully
    }
  }, []);

  const AppWithNavigation = () => {
    const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

    const handleNavigate = (path: string) => {
      setCurrentPath(path);
      window.history.pushState({}, '', path);
      window.location.href = path;
    };

    return (
      <ErrorBoundary>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navigation onNavigate={handleNavigate} currentPath={currentPath} />
          <NotificationSystem 
            enableEmailNotifications={true}
            enableSmsNotifications={false}
            emailAddress="user@example.com"
          />
          <Box sx={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<ModernLandingPage />} />
              <Route path="/auth" element={<AuthComponent />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactForm />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <EnhancedDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute>
                    <PaymentIntegration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <UserSettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <SubscriptionAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/currency" 
                element={
                  <ProtectedRoute>
                    <CurrencyConverter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/api-testing" 
                element={
                  <ProtectedRoute>
                    <ApiTestingDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<ModernLandingPage />} />
            </Routes>
          </Box>
        </Box>
      </ErrorBoundary>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <AuthProvider>
        <Router>
          <AppWithNavigation />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

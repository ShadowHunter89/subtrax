import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ModernLandingPage from './components/ModernLandingPage';

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
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(127, 90, 240, 0.15)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModernLandingPage />
    </ThemeProvider>
  );
};

export default App;
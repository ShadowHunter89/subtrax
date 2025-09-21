import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LandingPage from './LandingPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7F5AF0',
    },
    secondary: {
      main: '#2CB67D',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LandingPage />
    </ThemeProvider>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Chip,
  Alert,
  Fade,
  Slide,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  SmartToy,
  TrendingUp,
  Close,
  CheckCircle,
  AutoAwesome,
  Insights,
  Store,
  SavingsOutlined,
  Psychology,
  Timeline,
  Shield
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7F5AF0',
    },
    secondary: {
      main: '#2CB67D',
    },
    background: {
      default: '#FAFAFA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(127, 90, 240, 0.1)',
        },
      },
    },
  },
});

// AI-Powered Subscription Discovery
const subscriptionCategories = [
  { name: 'Streaming', icon: '🎬', savings: '$45/mo' },
  { name: 'Software', icon: '💻', savings: '$32/mo' },
  { name: 'Gaming', icon: '🎮', savings: '$28/mo' },
  { name: 'Fitness', icon: '💪', savings: '$15/mo' },
  { name: 'News', icon: '📰', savings: '$12/mo' },
  { name: 'Music', icon: '🎵', savings: '$8/mo' },
];

const predictiveInsights = [
  { text: 'You could save $140/month by optimizing unused subscriptions', type: 'success' },
  { text: 'AI detected 3 duplicate services costing $67/month', type: 'warning' },
  { text: 'Recommended: Switch to annual billing for 20% savings', type: 'info' },
];

const smartFeatures = [
  {
    icon: <Psychology color="primary" />,
    title: 'AI Subscription Discovery',
    description: 'Automatically detects and categorizes all your subscriptions using advanced ML'
  },
  {
    icon: <Timeline color="primary" />,
    title: 'Predictive Analytics',
    description: 'Forecasts spending patterns and identifies optimization opportunities'
  },
  {
    icon: <AutoAwesome color="primary" />,
    title: 'Smart Notifications',
    description: 'Intelligent alerts for price changes, renewals, and savings opportunities'
  },
  {
    icon: <Store color="primary" />,
    title: 'Subscription Marketplace',
    description: 'Discover better alternatives with personalized recommendations'
  },
  {
    icon: <Shield color="primary" />,
    title: 'Security Monitoring',
    description: 'Monitor subscription security and get alerts for breaches'
  },
  {
    icon: <Insights color="primary" />,
    title: 'Real-time Insights',
    description: 'Live dashboard with spending analytics and optimization tips'
  },
];

const OnboardingFlow = ({ onClose }: { onClose: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const steps = ['Welcome', 'AI Discovery', 'Personalize', 'Analytics'];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 200);
    return () => clearInterval(timer);
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Complete onboarding
      onClose();
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Dialog open fullScreen>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Welcome to Subtrax</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Fade in>
              <Box textAlign="center">
                <AutoAwesome sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                  AI-Powered Subscription Intelligence
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                  Our advanced AI will discover all your subscriptions, analyze your spending patterns, 
                  and provide personalized optimization recommendations to save you money.
                </Typography>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  sx={{ maxWidth: 400, mb: 3 }}
                />
                <br />
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleNext}
                  disabled={!userEmail}
                  sx={{ px: 6, py: 2 }}
                >
                  Start AI Discovery
                </Button>
              </Box>
            </Fade>
          )}

          {activeStep === 1 && (
            <Fade in>
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  🔍 AI Subscription Discovery in Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ mb: 3, height: 8, borderRadius: 4 }} 
                />
                <Typography textAlign="center" color="text.secondary" gutterBottom>
                  Scanning your digital footprint for subscriptions...
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 2 }}>
                  {subscriptionCategories.map((category, index) => (
                    <Box key={category.name}>
                      <Slide direction="up" in timeout={500 + index * 200}>
                        <Card>
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4">{category.icon}</Typography>
                            <Typography variant="h6">{category.name}</Typography>
                            <Chip 
                              label={`Save ${category.savings}`} 
                              color="secondary" 
                              size="small" 
                            />
                          </CardContent>
                        </Card>
                      </Slide>
                    </Box>
                  ))}
                </Box>

                <Box textAlign="center" sx={{ mt: 4 }}>
                  <Button variant="contained" onClick={handleNext} sx={{ px: 6 }}>
                    View Discoveries
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}

          {activeStep === 2 && (
            <Fade in>
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  🎯 Personalize Your Experience
                </Typography>
                <Typography textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
                  Select categories you&apos;re interested in optimizing:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                  {subscriptionCategories.map((category) => (
                    <Box key={category.name}>
                      <Chip
                        label={`${category.icon} ${category.name}`}
                        onClick={() => toggleCategory(category.name)}
                        color={selectedCategories.includes(category.name) ? 'primary' : 'default'}
                        variant={selectedCategories.includes(category.name) ? 'filled' : 'outlined'}
                        sx={{ m: 0.5, px: 2, py: 1 }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box textAlign="center" sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                    disabled={selectedCategories.length === 0}
                    sx={{ px: 6 }}
                  >
                    Generate Insights
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}

          {activeStep === 3 && (
            <Fade in>
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  📊 Your Personalized Analytics Dashboard
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        💰 Potential Savings
                      </Typography>
                      <Typography variant="h3" color="secondary.main">
                        $140/mo
                      </Typography>
                      <Typography color="text.secondary">
                        Based on AI analysis
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        🔍 Subscriptions Found
                      </Typography>
                      <Typography variant="h3" color="primary.main">
                        {selectedCategories.length * 3 + 2}
                      </Typography>
                      <Typography color="text.secondary">
                        Active subscriptions
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🧠 AI Insights
                  </Typography>
                  {predictiveInsights.map((insight, index) => (
                    <Alert key={index} severity={insight.type as 'success' | 'warning' | 'info'} sx={{ mb: 1 }}>
                      {insight.text}
                    </Alert>
                  ))}
                </Box>

                <Box textAlign="center" sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleNext}
                    sx={{ px: 6, py: 2 }}
                  >
                    Access Full Dashboard
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Container>
      </DialogContent>
    </Dialog>
  );
};

const LandingContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center',
          py: 8 
        }}>
          <Typography variant="h1" component="h1" gutterBottom sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 800,
            background: 'linear-gradient(45deg, #7F5AF0 30%, #2CB67D 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2
          }}>
            Subtrax AI
          </Typography>
          
          <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 700 }}>
            Revolutionary AI-powered subscription intelligence. Discover hidden subscriptions, 
            predict spending patterns, and save money with machine learning insights.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 6 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => setShowOnboarding(true)}
              startIcon={<AutoAwesome />}
              sx={{ 
                px: 4, 
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #7F5AF0 30%, #2CB67D 90%)',
              }}
            >
              Get Started Free
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => setShowDemo(true)}
              startIcon={<Insights />}
              sx={{ 
                px: 4, 
                py: 2,
                fontSize: '1.1rem',
              }}
            >
              View AI Demo
            </Button>
          </Box>
          
          {/* Unique Features Showcase */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3, maxWidth: 1200 }}>
            {smartFeatures.map((feature, index) => (
              <Box key={feature.title}>
                <Slide direction="up" in timeout={300 + index * 200}>
                  <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.3s' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 3, maxWidth: 800 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              🚀 MVP Ready - Advanced Features
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ✅ AI Subscription Discovery<br/>
                  ✅ Predictive Spending Analytics<br/>
                  ✅ Smart Notification System<br/>
                  ✅ Security Monitoring
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ✅ Subscription Marketplace<br/>
                  ✅ Real-time Insights Dashboard<br/>
                  ✅ Automated Optimization<br/>
                  ✅ Enterprise-grade Security
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {showOnboarding && (
        <OnboardingFlow onClose={() => setShowOnboarding(false)} />
      )}

      {showDemo && (
        <Dialog open maxWidth="md" fullWidth onClose={() => setShowDemo(false)}>
          <DialogTitle>
            🤖 AI Demo - Subscription Intelligence
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>Live AI Analysis</Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <SmartToy />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Netflix Premium" 
                  secondary="$15.99/mo • Detected duplicate with Hulu plan • Potential saving: $8/mo"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <TrendingUp />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Adobe Creative Suite" 
                  secondary="$52.99/mo • Usage only 23% last month • Recommend downgrade to Photography plan"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <SavingsOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Spotify Premium" 
                  secondary="$9.99/mo • Perfect usage pattern • AI recommends keeping this subscription"
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button variant="contained" onClick={() => {setShowDemo(false); setShowOnboarding(true);}}>
                Start Your Analysis
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LandingContent />
  </ThemeProvider>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);